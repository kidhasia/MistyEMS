import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Board.css';
import { backendUrl } from '../App';
import jsPDF from 'jspdf';

const Board = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState({ todo: [], inprogress: [], done: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized filtered columns to optimize performance
  const filteredColumns = useMemo(() => {
    if (searchQuery.trim() === '') {
      return columns;
    }
    const query = searchQuery.toLowerCase();
    return {
      todo: columns.todo.filter(
        (card) =>
          card.content?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.tags?.some((tag) => tag.toLowerCase().includes(query))
      ),
      inprogress: columns.inprogress.filter(
        (card) =>
          card.content?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.tags?.some((tag) => tag.toLowerCase().includes(query))
      ),
      done: columns.done.filter(
        (card) =>
          card.content?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.tags?.some((tag) => tag.toLowerCase().includes(query))
      ),
    };
  }, [searchQuery, columns]);

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

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 8;
    let yOffset = margin;

    const checkPageBreak = (requiredHeight) => {
      if (yOffset + requiredHeight > pageHeight - 20) {
        doc.addPage();
        yOffset = margin;
      }
    };

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(
          `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
          margin,
          pageHeight - 10
        );
      }
    };

    Object.entries(filteredColumns).forEach(([status, cards]) => {
      const columnTitle =
        status === 'todo' ? 'To Do' :
          status === 'inprogress' ? 'In Progress' : 'Done';

      const columnColor =
        status === 'todo' ? [255, 105, 180] :
          status === 'inprogress' ? [186, 85, 211] : [147, 112, 219];

      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`${columnTitle} (${cards.length})`, margin, yOffset);
      yOffset += lineHeight + 2;

      doc.setDrawColor(columnColor[0], columnColor[1], columnColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, margin + 50, yOffset);
      yOffset += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(0);

      cards.forEach((card, index) => {
        const lines = [
          `Card ${index + 1}: ${card.content || 'No Content'}`,
          `Description: ${card.description || 'N/A'}`,
          `Due: ${card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'N/A'}`,
          `Priority: ${card.priority || 'N/A'}`,
          `Tags: ${card.tags && card.tags.length > 0 ? card.tags.join(', ') : 'None'}`,
          `Status: ${card.status === 'todo' ? 'To Do' :
            card.status === 'inprogress' ? 'In Progress' : 'Done'
          }`,
          `Created: ${card.createdAt ? new Date(card.createdAt).toLocaleString() : 'N/A'}`
        ];

        const wrappedLines = lines.flatMap((line) =>
          doc.splitTextToSize(line, maxWidth - 10)
        );
        const textBlockHeight = wrappedLines.length * lineHeight + 15;

        checkPageBreak(textBlockHeight + 10);

        doc.setFillColor(255, 240, 245);
        doc.setDrawColor(200);
        doc.roundedRect(margin, yOffset, maxWidth, textBlockHeight, 3, 3, 'FD');

        doc.setFillColor(220, 220, 220);
        doc.roundedRect(margin + 1, yOffset + 1, maxWidth, textBlockHeight, 3, 3, 'F');

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(200);
        doc.roundedRect(margin, yOffset, maxWidth, textBlockHeight, 3, 3, 'FD');

        wrappedLines.forEach((line, i) => {
          doc.text(line, margin + 5, yOffset + 10 + i * lineHeight);
        });

        if (card.tags && card.tags.length > 0) {
          let tagX = margin + 5;
          card.tags.forEach((tag) => {
            const tagWidth = doc.getTextWidth(tag) + 6;
            if (tagX + tagWidth < pageWidth - margin) {
              doc.setFillColor(columnColor[0], columnColor[1], columnColor[2]);
              doc.roundedRect(tagX, yOffset + textBlockHeight - 8, tagWidth, 6, 2, 2, 'F');
              doc.setTextColor(0);
              doc.setFontSize(14);
              doc.text(tag, tagX + 3, yOffset + textBlockHeight - 4);
              tagX += tagWidth + 5;
            }
          });
        }

        yOffset += textBlockHeight + 10;
      });

      yOffset += 10;
    });

    addFooter();
    doc.save('kanban-board.pdf');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="board-container">
      <div className="header-container">
        <div className="pdf-button-container">
          <button
            className="generate-pdf-btn"
            onClick={generatePDF}
          >
            Generate PDF
          </button>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search cards by content, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={`board ${searchQuery ? 'no-transitions' : ''}`}>
        {Object.entries(filteredColumns).map(([status, cards]) => (
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
      <ToastContainer />
    </div>
  );
};

export default Board;