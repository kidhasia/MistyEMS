// src/pages/Board.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure styles are imported
import './styles/Board.css';
import { backendUrl } from '../App';

const Board = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/cards`);
      if (!response.ok) throw new Error('Failed to fetch cards');
      const cards = await response.json();
      const organizedCards = {
        todo: cards.filter((card) => card.status === 'todo'),
        inprogress: cards.filter((card) => card.status === 'inprogress'),
        done: cards.filter((card) => card.status === 'done'),
      };
      setColumns(organizedCards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (columnKey, cardId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this card?</p>
          <button
            style={{
              marginRight: '10px',
              background: '#3085d6',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
            }}
            onClick={async () => {
              try {
                const response = await fetch(`${backendUrl}/api/cards/${cardId}`, {
                  method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete card');
                setColumns((prev) => ({
                  ...prev,
                  [columnKey]: prev[columnKey].filter((card) => card._id !== cardId),
                }));
                toast.success('Card deleted successfully');
              } catch (err) {
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

  const handleStatusChange = async (card, newStatus) => {
    const oldColumnKey = Object.keys(columns).find((key) =>
      columns[key].some((c) => c._id === card._id)
    );

    if (oldColumnKey !== newStatus) {
      try {
        const response = await fetch(`${backendUrl}/api/cards/${card._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...card, status: newStatus }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        const updatedCard = await response.json();
        setColumns((prev) => ({
          ...prev,
          [oldColumnKey]: prev[oldColumnKey].filter((c) => c._id !== card._id),
          [newStatus]: [...prev[newStatus], updatedCard],
        }));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddCard = (status) => {
    navigate('/add-card', { state: { status } });
  };

  const handleEditCard = (card) => {
    navigate('/edit-card', { state: { card } });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="board">
      {Object.entries(columns).map(([status, cards]) => (
        <div className="column" key={status} data-status={status}>
          <div className="column-header">
            <span className="column-title">
              {status === 'todo'
                ? 'To Do'
                : status === 'inprogress'
                ? 'In Progress'
                : 'Done'}
            </span>
            <span className="card-count">{cards.length}</span>
          </div>

          {cards.map((card) => (
            <div className="card" key={card._id}>
              <div className="card-content">{card.content}</div>
              <div className="card-details">
                <p className="description">{card.description}</p>
                <p className="due-date">
                  Due: {new Date(card.dueDate).toLocaleDateString()}
                </p>
                <p className="priority">Priority: {card.priority}</p>
              </div>
              <div className="tags">
                {card.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-actions">
                <select
                  className="status-select"
                  value={status}
                  onChange={(e) => handleStatusChange(card, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  className="edit-btn"
                  onClick={() => handleEditCard(card)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(status, card._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button className="add-card" onClick={() => handleAddCard(status)}>
            + Add Card
          </button>
        </div>
      ))}
    </div>
  );
};

export default Board;