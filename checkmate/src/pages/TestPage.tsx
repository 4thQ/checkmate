import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTests } from '../context/TestContext';
import { Test, TestResult } from '../types';
import TestResults from '../components/TestResults';

const TestPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { getTest, saveResult } = useTests();
  
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Load the test
  useEffect(() => {
    if (testId) {
      const foundTest = getTest(testId);
      if (foundTest) {
        setTest(foundTest);
      } else {
        navigate('/tests');
      }
    }
  }, [testId, getTest, navigate]);

  // Get the current question
  const currentQuestion = test && test.questions.length > 0
    ? test.questions[currentQuestionIndex]
    : null;
  
  // Calculate progress percentage
  const progressPercentage = test && test.questions.length > 0
    ? ((currentQuestionIndex + 1) / test.questions.length) * 100
    : 0;

  // Handle starting the test
  const handleStartTest = () => {
    setIsTestStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsTestFinished(false);
    setTestResult(null);
  };

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answerId: string) => {
    // Don't allow changing answer if already answered
    if (answers[questionId]) return;
    
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  // Check if an answer is incorrect
  const isAnswerIncorrect = (questionId: string, answerId: string) => {
    if (!test) return false;
    const question = test.questions.find(q => q.id === questionId);
    if (!question) return false;
    return question.correctAnswer !== answerId;
  };

  // Handle short answer input
  const handleShortAnswerChange = (questionId: string, answer: string) => {
    // If the answer is already locked in, don't allow changes
    if (answers[questionId] && typeof answers[questionId] === 'string' && 
        (answers[questionId] as string).endsWith('_locked')) {
      return;
    }
    
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  // Submit short answer and lock it
  const submitShortAnswer = (questionId: string) => {
    const currentAnswer = answers[questionId];
    if (!currentAnswer) return;
    
    setAnswers({
      ...answers,
      [questionId]: `${currentAnswer}_locked`
    });
  };

  // Handle key press for short answer submission
  const handleShortAnswerKeyPress = (e: React.KeyboardEvent, questionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitShortAnswer(questionId);
    }
  };

  // Go to the next question
  const handleNextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish the test
      finishTest();
    }
  };

  // Go to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Helper function to get clean answer text
  const getCleanAnswerText = (answer: string | string[]): string | string[] => {
    if (typeof answer === 'string' && answer.endsWith('_locked')) {
      return answer.replace('_locked', '');
    }
    return answer;
  };

  // Calculate the test score
  const calculateScore = () => {
    if (!test) return 0;
    
    let correctAnswers = 0;
    
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      
      const cleanAnswer = getCleanAnswerText(userAnswer);
      
      if (question.type === 'true-false') {
        if (cleanAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === 'short-answer') {
        // Case insensitive matching for short answers
        if (typeof cleanAnswer === 'string' && 
            typeof question.correctAnswer === 'string' && 
            cleanAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correctAnswers++;
        }
      }
    });
    
    return correctAnswers;
  };

  // Finish the test and calculate the score
  const finishTest = () => {
    if (!test) return;
    
    const score = calculateScore();
    const result: TestResult = {
      testId: test.id,
      score,
      totalQuestions: test.questions.length,
      completedAt: Date.now(),
      answers
    };
    
    saveResult(result);
    setTestResult(result);
    setIsTestFinished(true);
  };

  // If the test is finished, show the results
  if (isTestFinished && test && testResult) {
    return <TestResults test={test} result={testResult} onRetake={handleStartTest} />;
  }

  // If the test is not found, show an error
  if (!test) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', margin: '3rem auto', maxWidth: '600px' }}>
          <h2>Test Not Found</h2>
          <p style={{ margin: '1rem 0' }}>
            The test you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/tests">
            <button>Browse Tests</button>
          </Link>
        </div>
      </div>
    );
  }

  // If the test is not started, show the test details
  if (!isTestStarted) {
    return (
      <div className="container">
        <h1>{test.title}</h1>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>{test.description || 'No description provided.'}</p>
          <p><strong>Number of questions:</strong> {test.questions.length}</p>
          <p><strong>Created:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
          <div style={{ marginTop: '2rem' }}>
            <button onClick={handleStartTest}>Start Test</button>
          </div>
        </div>
      </div>
    );
  }

  // Show the current question
  return (
    <div className="container question-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2>Question {currentQuestionIndex + 1} of {test.questions.length}</h2>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem' }}>{currentQuestion?.text}</p>
        </div>
        
        {currentQuestion?.type === 'true-false' && (
          <ul className="options-list">
            <li 
              className={`option-item ${answers[currentQuestion.id] === 'true' ? 'selected' : ''} ${
                answers[currentQuestion.id] === 'true' && isAnswerIncorrect(currentQuestion.id, 'true') ? 'incorrect' : ''
              }`} 
              onClick={() => handleAnswerChange(currentQuestion.id, 'true')}
              style={{ 
                cursor: answers[currentQuestion.id] ? 'not-allowed' : 'pointer',
                opacity: answers[currentQuestion.id] && answers[currentQuestion.id] !== 'true' ? 0.7 : 1
              }}
            >
              True
            </li>
            <li 
              className={`option-item ${answers[currentQuestion.id] === 'false' ? 'selected' : ''} ${
                answers[currentQuestion.id] === 'false' && isAnswerIncorrect(currentQuestion.id, 'false') ? 'incorrect' : ''
              }`}
              onClick={() => handleAnswerChange(currentQuestion.id, 'false')}
              style={{ 
                cursor: answers[currentQuestion.id] ? 'not-allowed' : 'pointer',
                opacity: answers[currentQuestion.id] && answers[currentQuestion.id] !== 'false' ? 0.7 : 1
              }}
            >
              False
            </li>
          </ul>
        )}
        
        {currentQuestion?.type === 'short-answer' && (
          <div className="form-group">
            <label htmlFor="short-answer">Your Answer</label>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                id="short-answer"
                value={
                  typeof answers[currentQuestion.id] === 'string' && 
                  (answers[currentQuestion.id] as string).endsWith('_locked')
                    ? (answers[currentQuestion.id] as string).replace('_locked', '')
                    : (answers[currentQuestion.id] || '') as string
                }
                onChange={(e) => handleShortAnswerChange(currentQuestion.id, e.target.value)}
                onKeyPress={(e) => handleShortAnswerKeyPress(e, currentQuestion.id)}
                placeholder="Type your answer here"
                disabled={
                  typeof answers[currentQuestion.id] === 'string' && 
                  (answers[currentQuestion.id] as string).endsWith('_locked')
                }
                className={
                  answers[currentQuestion.id] && 
                  typeof answers[currentQuestion.id] === 'string' &&
                  (answers[currentQuestion.id] as string).endsWith('_locked') &&
                  typeof currentQuestion.correctAnswer === 'string' &&
                  (answers[currentQuestion.id] as string).replace('_locked', '') !== currentQuestion.correctAnswer 
                    ? 'incorrect-input' 
                    : ''
                }
                style={{ flex: 1 }}
              />
              {answers[currentQuestion.id] && 
               typeof answers[currentQuestion.id] === 'string' && 
               !(answers[currentQuestion.id] as string).endsWith('_locked') && (
                <button
                  onClick={() => submitShortAnswer(currentQuestion.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Submit
                </button>
              )}
            </div>
            {answers[currentQuestion.id] && 
             typeof answers[currentQuestion.id] === 'string' && 
             (answers[currentQuestion.id] as string).endsWith('_locked') && (
              <button
                onClick={() => handleNextQuestion()}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Continue to Next Question
              </button>
            )}
          </div>
        )}
        
        <div className="navigation-buttons">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={{ 
              backgroundColor: currentQuestionIndex === 0 ? 'var(--secondary-color)' : 'var(--accent-color)',
              opacity: currentQuestionIndex === 0 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex === test.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 