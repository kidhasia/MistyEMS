// src/pages/AddCard.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles/addCard.css';
import { backendUrl } from '../App';

const AddCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || { status: 'todo' }; // Default to 'todo' if no state
  const [formData, setFormData] = useState({
    content: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status,
    tags: '',
  });
  
  // Store validation errors for each field
  const [validationErrors, setValidationErrors] = useState({
    content: '',
    description: '',
    dueDate: '',
    tags: '',
  });
  
  // Store API error
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate the form before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...validationErrors };
    
    // Content validation - required and length check
    if (!formData.content.trim()) {
      newErrors.content = 'Task title is required';
      isValid = false;
    } else if (formData.content.length > 100) {
      newErrors.content = 'Task title must be less than 100 characters';
      isValid = false;
    }
    
    // Description length validation
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
      isValid = false;
    }
    
    // Due date validation - must be today or in the future
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
        isValid = false;
      }
    }
    
    // Tags validation - format check
    if (formData.tags) {
      const tagPattern = /^[a-zA-Z0-9, ]+$/;
      if (!tagPattern.test(formData.tags)) {
        newErrors.tags = 'Tags can only contain letters, numbers, and commas';
        isValid = false;
      }
      
      // Check individual tag length
      const tags = formData.tags.split(',').map(tag => tag.trim());
      const longTags = tags.filter(tag => tag.length > 20);
      
      if (longTags.length > 0) {
        newErrors.tags = 'Each tag must be less than 20 characters';
        isValid = false;
      }
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to add this card?</p>
          <button
            style={{
              marginRight: '10px',
              background: '#3085d6',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
            }}
            onClick={async () => {
              const newCard = {
                content: formData.content,
                description: formData.description,
                dueDate: formData.dueDate,
                priority: formData.priority,
                status: formData.status,
                tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
              };

              try {
                const response = await fetch(`${backendUrl}/api/cards`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newCard),
                });
                
                // Handle non-2xx responses
                if (!response.ok) {
                  const errorData = await response.json().catch(() => null);
                  throw new Error(errorData?.message || 'Failed to create card');
                }
                
                toast.success('Card added successfully');
                navigate('/'); // Navigate back to Board
              } catch (err) {
                setError(err.message);
                toast.error(err.message);
              }
              closeToast();
            }}
          >
            Yes
          </button>
          <button
            style={{
              background: '#d33',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
            }}
            onClick={closeToast}
          >
            No
          </button>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>Add New Task</h2>
      {error && <div className="error">Error: {error}</div>}
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-title">Task Title</label>
          <input
            type="text"
            id="task-title"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            className={validationErrors.content ? 'input-error' : ''}
          />
          {/* Display validation error message for content */}
          {validationErrors.content && (
            <div className="error-message">{validationErrors.content}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            className={validationErrors.description ? 'input-error' : ''}
          />
          {/* Display validation error message for description */}
          {validationErrors.description && (
            <div className="error-message">{validationErrors.description}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="due-date">Due Date</label>
            <input
              type="date"
              id="due-date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className={validationErrors.dueDate ? 'input-error' : ''}
            />
            {/* Display validation error message for due date */}
            {validationErrors.dueDate && (
              <div className="error-message">{validationErrors.dueDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="form-group short-input">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., UI, Design"
            className={validationErrors.tags ? 'input-error' : ''}
          />
          {/* Display validation error message for tags */}
          {validationErrors.tags && (
            <div className="error-message">{validationErrors.tags}</div>
          )}
          {/* Add helper text for tags */}
          <small className="helper-text">Separate multiple tags with commas</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Task
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCard;