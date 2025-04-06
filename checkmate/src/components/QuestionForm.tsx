import React, { useState, useEffect } from 'react';
import { Question, QuestionType, Option } from '../types';
import { useId } from '../hooks/useId';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const generateId = useId();
  
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [questionType, setQuestionType] = useState<QuestionType>('true-false');
  const [options, setOptions] = useState<Option[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>('');
  
  // Initialize the form with the question data if editing an existing question
  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setQuestionType(question.type);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);
    } else {
      // Initialize with true/false options
      const trueOption = { id: 'true', text: 'True' };
      const falseOption = { id: 'false', text: 'False' };
      setOptions([trueOption, falseOption]);
      setCorrectAnswer('true');
    }
  }, [question, generateId]);

  // Handle changing the question type
  const handleTypeChange = (type: QuestionType) => {
    setQuestionType(type);
    
    // Reset options and correct answer based on the new type
    if (type === 'true-false') {
      const trueOption = { id: 'true', text: 'True' };
      const falseOption = { id: 'false', text: 'False' };
      setOptions([trueOption, falseOption]);
      setCorrectAnswer('true');
    } else if (type === 'short-answer') {
      setOptions([]);
      setCorrectAnswer('');
    }
  };

  // Save the question
  const handleSave = () => {
    // Validate the form
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (questionType === 'short-answer') {
      // Ensure there's a correct answer for short answer
      if (!correctAnswer) {
        alert('Please enter a correct answer');
        return;
      }
    }

    const newQuestion: Question = {
      id: question?.id || generateId(),
      text: questionText,
      type: questionType,
      options: questionType === 'short-answer' ? [] : options,
      correctAnswer: correctAnswer
    };

    onSave(newQuestion);
  };

  return (
    <div className="question-form">
      <h3 className="form-title">{question ? 'Edit Question' : 'Add New Question'}</h3>
      
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="questionText">Question</label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here..."
            className="question-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="questionType">Question Type</label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
          >
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
          </select>
        </div>
        
        {questionType === 'true-false' && (
          <div className="form-group">
            <label>Correct Answer</label>
            <div className="radio-group">
              <label className={`radio-option radio-true ${correctAnswer === 'true' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="true-false"
                  value="true"
                  checked={correctAnswer === 'true'}
                  onChange={() => setCorrectAnswer('true')}
                />
                <span className="radio-label">
                  <span className="radio-mark"></span>
                  True
                </span>
              </label>
              <label className={`radio-option radio-false ${correctAnswer === 'false' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="true-false"
                  value="false"
                  checked={correctAnswer === 'false'}
                  onChange={() => setCorrectAnswer('false')}
                />
                <span className="radio-label">
                  <span className="radio-mark"></span>
                  False
                </span>
              </label>
            </div>
          </div>
        )}
        
        {questionType === 'short-answer' && (
          <div className="form-group">
            <label htmlFor="correctAnswer">Correct Answer</label>
            <input
              type="text"
              id="correctAnswer"
              value={correctAnswer as string}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Enter the correct answer"
            />
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {question ? 'Update Question' : 'Add Question'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm; 