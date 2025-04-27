import React, { useState, useEffect, useRef } from 'react';

const ScheduleModal = ({ isOpen, onClose, onSubmit, initialData, position }) => {
  const [formData, setFormData] = useState({
    subject: '',
    student: '',
    teacher: '',
    endTime: '',
    comment: '',
    ...initialData,
  });

  const modalRef = useRef(null); // создаём ref для модалки

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        background: 'rgba(0,0,0,0.9)',
        border: '2px solid #00f0ff',
        borderRadius: '12px',
        padding: '20px',
        zIndex: 1000,
        color: '#fff',
        minWidth: '300px',
        boxShadow: '0 0 20px #00f0ff',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      {/* форма остаётся той же */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Предмет"
          style={{ padding: '8px', borderRadius: '8px' }}
        />
        <input
          name="student"
          value={formData.student}
          onChange={handleChange}
          placeholder="Студент"
          style={{ padding: '8px', borderRadius: '8px' }}
        />
        <input
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          placeholder="Учитель"
          style={{ padding: '8px', borderRadius: '8px' }}
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          placeholder="Время окончания"
          style={{ padding: '8px', borderRadius: '8px' }}
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Комментарий"
          style={{ padding: '8px', borderRadius: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0ff', color: '#000', borderRadius: '8px', cursor: 'pointer' }}>
          Сохранить
        </button>
        <button type="button" onClick={onClose} style={{ padding: '10px', background: '#333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
          Закрыть
        </button>
      </form>

    </div>
  );
};

export default ScheduleModal;
