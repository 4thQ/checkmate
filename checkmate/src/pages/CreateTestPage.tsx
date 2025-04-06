import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTests } from '../context/TestContext';
import { useId } from '../hooks/useId';
import { Test, Question } from '../types';
import QuestionForm from '../components/QuestionForm';

const CreateTestPage = () => {
  const { testId } = useParams<{ testId?: string }>();
  const navigate = useNavigate();
  const { addTest, getTest, updateTest } = useTests();
  const generateId = useId();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load test data if editing an existing test
  useEffect(() => {
    if (testId) {
      const existingTest = getTest(testId);
      if (existingTest) {
        setTitle(existingTest.title);
        setDescription(existingTest.description);
        setQuestions(existingTest.questions);
        setIsEditing(true);
      } else {
        // Test not found, redirect to create page
        navigate('/create');
      }
    }
  }, [testId, getTest, navigate]);

  // Save a question
  const handleSaveQuestion = (question: Question) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      setQuestions([...questions, question]);
    }
    
    setShowQuestionForm(false);
    setEditingQuestionIndex(null);
  };

  // Edit a question
  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  // Move a question up
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedQuestions = [...questions];
      [updatedQuestions[index], updatedQuestions[index - 1]] = 
      [updatedQuestions[index - 1], updatedQuestions[index]];
      setQuestions(updatedQuestions);
    }
  };

  // Move a question down
  const handleMoveDown = (index: number) => {
    if (index < questions.length - 1) {
      const updatedQuestions = [...questions];
      [updatedQuestions[index], updatedQuestions[index + 1]] = 
      [updatedQuestions[index + 1], updatedQuestions[index]];
      setQuestions(updatedQuestions);
    }
  };

  // Save the test
  const handleSaveTest = () => {
    // Validate the form
    if (!title.trim()) {
      alert('Please enter a test title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    if (isEditing && testId) {
      // Update existing test
      const updatedTest: Test = {
        id: testId,
        title: title.trim(),
        description: description.trim(),
        questions,
        createdAt: getTest(testId)?.createdAt || Date.now(),
        lastModified: Date.now()
      };
      updateTest(updatedTest);
    } else {
      // Create new test
      const newTest: Test = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        questions,
        createdAt: Date.now(),
        lastModified: Date.now()
      };
      addTest(newTest);
    }
    
    navigate('/tests');
  };

  return (
    <div className="container">
      <h1>{isEditing ? 'Edit Test' : 'Create New Test'}</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label htmlFor="test-title">Test Title</label>
          <input
            type="text"
            id="test-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter test title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="test-description">Description (Optional)</label>
          <textarea
            id="test-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter test description"
            rows={3}
          />
        </div>
      </div>

      <h2>Questions</h2>
      
      {questions.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {questions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div>
                <strong>Question {index + 1}:</strong> {question.text}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Type: {question.type}
              </div>
              <div className="question-controls">
                {index > 0 && (
                  <button
                    className="control-btn"
                    onClick={() => handleMoveUp(index)}
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < questions.length - 1 && (
                  <button
                    className="control-btn"
                    onClick={() => handleMoveDown(index)}
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  className="control-btn"
                  onClick={() => handleEditQuestion(index)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="control-btn"
                  onClick={() => handleDeleteQuestion(index)}
                  title="Delete"
                  style={{ color: 'var(--error-color)' }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showQuestionForm ? (
        <QuestionForm
          question={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setShowQuestionForm(false);
            setEditingQuestionIndex(null);
          }}
        />
      ) : (
        <button
          onClick={() => setShowQuestionForm(true)}
          style={{ marginBottom: '2rem' }}
        >
          + Add Question
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)' }}
        >
          Cancel
        </button>
        <button onClick={handleSaveTest}>
          {isEditing ? 'Update Test' : 'Save Test'}
        </button>
      </div>
    </div>
  );
};

export default CreateTestPage; 