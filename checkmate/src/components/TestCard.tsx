import React, { useState } from 'react';
import { Test } from '../types';
import { useTests } from '../context/TestContext';
import { useNavigate } from 'react-router-dom';

interface TestCardProps {
  test: Test;
  onDelete: (id: string) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onDelete }) => {
  const { deleteTest } = useTests();
  const navigate = useNavigate();
  const formattedDate = new Date(test.lastModified).toLocaleDateString();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Handle deleting a test with confirmation
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    deleteTest(test.id);
    setShowDeleteModal(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Navigate to test page
  const handleTakeTest = () => {
    navigate(`/test/${test.id}`);
  };

  // Navigate to edit page
  const handleEditTest = () => {
    navigate(`/edit/${test.id}`);
  };
  
  return (
    <div className="minimal-card">
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3>Confirm Delete</h3>
            </div>
            <p>Are you sure you want to delete "{test.title}"? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="cancel-modal-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-modal-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="minimal-card-content">
        <div className="minimal-card-badge">{test.questions.length} Questions</div>
        <h3 className="minimal-card-title">{test.title}</h3>
        <p className="minimal-card-description">{test.description || "No description available"}</p>
        
        <div className="minimal-card-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
      
      <div className="minimal-card-actions">
        <button 
          className="minimal-button primary-action" 
          onClick={handleTakeTest}
          aria-label="Take Test"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Take Test</span>
        </button>
        
        <div className="action-buttons">
          <button 
            className="action-button edit-button" 
            onClick={handleEditTest}
            title="Edit Test"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"/>
            </svg>
            <span>Edit</span>
          </button>
          
          <button 
            className="action-button delete-button" 
            onClick={handleDeleteClick}
            title="Delete Test"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6H5H21"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"/>
              <path d="M10 11V17"/>
              <path d="M14 11V17"/>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard; 