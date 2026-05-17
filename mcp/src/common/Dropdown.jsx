import React, { useState } from 'react';
import '../App.css';

const Dropdown = () => {
  const options = [
    { id: 0, title: 'Credit Team User' },
    { id: 1, title: 'Credit Manager' },
    { id: 2, title: 'Approved Admin' },
    { id: 3, title: 'Sales Rep' },
    { id: 4, title: 'AR/Collections' },
    { id: 5, title: 'Executive Viewer' }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0].title);

  const handleSelect = (option) => {
    setSelected(option.title);
    setIsOpen(false);
  };

  return (
    <div className="preview-as" style={{ position: "relative" }}>
      <span className="preview-as-label">PREVIEW AS</span>

      <button
        className="preview-as-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="preview-as-info">
          <span className="preview-as-role">{selected}</span>
          <span className="preview-as-sub">
            Operational queues, cases, dealers, decisions
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <ul className="preview-as-list">
          {options.map((option) => (
            <li
              key={option.id}
              className="preview-as-options"
              onClick={() => handleSelect(option)}
            >
              <div className="preview-as-role">{option.title}</div>
              <div className="preview-as-sub">Operational queues, cases, dealers, decisions</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
