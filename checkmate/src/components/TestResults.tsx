import { Link } from 'react-router-dom';
import { Test, TestResult } from '../types';

interface TestResultsProps {
  test: Test;
  result: TestResult;
  onRetake: () => void;
}

// Helper function to get clean answer text
const getCleanAnswerText = (answer: string | string[] | undefined): string => {
  if (!answer) return 'Not answered';
  
  if (typeof answer === 'string') {
    // Remove the _locked suffix if present
    return answer.endsWith('_locked') ? answer.replace('_locked', '') : answer;
  }
  
  return String(answer);
};

const TestResults = ({ test, result, onRetake }: TestResultsProps) => {
  const score = result.score;
  const totalQuestions = result.totalQuestions;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Get feedback based on score percentage
  const getFeedback = () => {
    if (percentage >= 90) return "Excellent! You've mastered this test!";
    if (percentage >= 75) return "Great job! You're doing well!";
    if (percentage >= 60) return "Good work! Keep studying to improve.";
    if (percentage >= 40) return "You're making progress. Keep practicing!";
    return "Don't give up! With more practice, you'll improve.";
  };
  
  return (
    <div className="container results-container">
      <h1>Test Results</h1>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>{test.title}</h2>
        
        <div className="score-display">
          {percentage}%
        </div>
        
        <p>You got {score} out of {totalQuestions} questions correct.</p>
        
        <p style={{ 
          color: percentage >= 60 ? 'var(--success-color)' : 'var(--warning-color)',
          fontWeight: 'bold',
          margin: '1.5rem 0'
        }}>
          {getFeedback()}
        </p>
        
        <div className="results-buttons">
          <button onClick={onRetake}>Retake Test</button>
          <Link to="/tests">
            <button style={{ backgroundColor: 'var(--secondary-color)' }}>
              Back to Tests
            </button>
          </Link>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2>Detailed Review</h2>
        
        {test.questions.map((question, index) => {
          const userAnswer = result.answers[question.id];
          const isCorrect = 
            question.type === 'true-false'
              ? userAnswer === question.correctAnswer
              : typeof userAnswer === 'string' && 
                typeof question.correctAnswer === 'string' && 
                getCleanAnswerText(userAnswer).toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          
          return (
            <div 
              key={question.id} 
              className="card" 
              style={{ 
                marginBottom: '1.5rem',
                borderLeft: `4px solid ${isCorrect ? 'var(--success-color)' : 'var(--error-color)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>Question {index + 1}</h3>
                <span style={{ 
                  color: isCorrect ? 'var(--success-color)' : 'var(--error-color)',
                  fontWeight: 'bold'
                }}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>{question.text}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <div>
                  <strong>Your Answer:</strong> {
                    question.type === 'true-false' 
                      ? userAnswer || 'Not answered'
                      : getCleanAnswerText(userAnswer)
                  }
                </div>
                
                <div style={{ marginTop: '0.5rem', color: 'var(--success-color)' }}>
                  <strong>Correct Answer:</strong> {
                    question.type === 'true-false'
                      ? question.correctAnswer as string
                      : question.correctAnswer as string
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestResults; 