// src/pages/SchedulePage.jsx
import React from 'react';
import './SchedulePage.css';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const cabinets = ['Каб 1', 'Каб 2', 'Каб 3'];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 22; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  slots.push(`23:00`);
  return slots;
};

const hours = generateTimeSlots();

// Заглушечные пары
const scheduleItems = [
  {
    id: 1,
    day: 'Пн',
    cabinet: 'Каб 1',
    time: '10:00',
    title: 'АМ',
  },
  {
    id: 2,
    day: 'Пн',
    cabinet: 'Каб 2',
    time: '11:30',
    title: 'АМ',
  },
  {
    id: 3,
    day: 'Ср',
    cabinet: 'Каб 3',
    time: '14:00',
    title: 'РИ',
  },
];

// Компонент одного занятия
function ScheduleItem({ title }) {
  return (
    <div className="schedule-item">
      {title}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="calendar-container">
      {/* Заголовки */}
      <div
        className="calendar-header-grid"
        style={{
          gridTemplateColumns: `60px repeat(${days.length * cabinets.length}, 1fr)`,
        }}
      >
        <div className="calendar-header empty"></div>
        {days.map((day) => (
          <div key={day} className="calendar-day" style={{ gridColumn: `span 3` }}>
            {day}
          </div>
        ))}
        <div className="calendar-header empty"></div>
        {days.map((day) =>
          cabinets.map((cabinet) => (
            <div
              key={`${day}-${cabinet}`}
              className="calendar-cabinet"
              style={{
                borderRight: cabinet === 'Каб 3' ? '3px solid #00f7ff' : '1px solid #2c2c2c',
              }}
            >
              {cabinet}
            </div>
          ))
        )}
      </div>

      {/* Сетка */}
      <div
        className="calendar-grid"
        style={{
          gridTemplateColumns: `60px repeat(${days.length * cabinets.length}, 1fr)`,
        }}
      >
        {hours.map((hour, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="calendar-time">{hour}</div>
            {days.map((day) =>
              cabinets.map((cabinet) => {
                // Проверяем, есть ли занятие в этом слоте
                const item = scheduleItems.find(
                  (i) => i.day === day && i.cabinet === cabinet && i.time === hour
                );

                return (
                  <div
                    key={`${rowIndex}-${day}-${cabinet}`}
                    className="calendar-cell"
                    style={{
                      borderRight: cabinet === 'Каб 3' ? '3px solid #00f7ff' : '1px solid #2c2c2c',
                    }}
                  >
                    {item && <ScheduleItem title={item.title} />}
                  </div>
                );
              })
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
