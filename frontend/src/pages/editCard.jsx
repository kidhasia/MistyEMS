// src/pages/EditCard.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles/addCard.css'; 
import { backendUrl } from '../App';

const EditCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { card } = location.state || {};

  const [formData, setFormData] = useState({
    content: card?.content || '',
    description: card?.description || '',
    dueDate: card?.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '',
    priority: card?.priority || 'Medium',
    status: card?.status || 'todo',
    tags: card?.tags.join(', ') || '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to save changes to this card?</p>
          <button
            style={{
              marginRight: '10px',
              background: '#3085d6',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
            }}
            onClick={async () => {
              const updatedCard = {
                content: formData.content,
                description: formData.description,
                dueDate: formData.dueDate,
                priority: formData.priority,
                status: formData.status,
                tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
              };

              try {
                const response = await fetch(`${backendUrl}/api/cards/${card._id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updatedCard),
                });
                if (!response.ok) throw new Error('Failed to update card');
                toast.success('Card updated successfully');
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
      <h2>Edit Task</h2>
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
          />
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
          />
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
            />
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
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCard;