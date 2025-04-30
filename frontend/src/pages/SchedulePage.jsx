import React, { useEffect, useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import './SchedulePage.css';
import { connectSocket, disconnectSocket, onScheduleUpdated, offScheduleUpdated } from '../services/socketService';
import { fetchSchedule, updateScheduleItem } from '../services/scheduleService';
import { format, addMinutes, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

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

function normalizeScheduleData(serverData) {
  if (!Array.isArray(serverData)) {
    console.error('Ожидался массив данных, но пришло:', serverData);
    return [];
  }

  return serverData.map(item => {
    const dayDate = item.day ? parseISO(item.day) : new Date();
    const dayName = format(dayDate, 'EE', { locale: ru });

    const time = typeof item.time_start === 'string'
      ? item.time_start.slice(0, 5)
      : '00:00';

    return {
      id: String(item.id ?? ''),
      day: capitalizeFirstLetter(dayName).slice(0, 2),
      cabinet: "Каб " + String(item.cabinet ?? '1'),
      time,
      title: "Xsuuuu"
    };
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const hours = generateTimeSlots();

// Компонент одного занятия
function ScheduleItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : 'auto',
  };

  return (
    <motion.div
      className="schedule-item"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="schedule-item-content">
        <div className="schedule-item-time">{item.time}</div>
        <div className="schedule-item-title">{item.title}</div>
      </div>
    </motion.div>

  );
}

// Компонент ячейки
function CalendarCell({ day, cabinet, hour, children, onDropItem }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${day}-${cabinet}-${hour}`,
    data: { day, cabinet, hour },
  });

  return (
    <div
      ref={setNodeRef}
      className="calendar-cell"
      style={{
        borderRight: cabinet === 'Каб 3' ? '3px solid #00f7ff' : '1px solid #2c2c2c',
        backgroundColor: isOver ? 'rgba(0, 247, 255, 0.1)' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </div>
  );
}

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState([]);


  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchSchedule();
        const normalizedData = normalizeScheduleData(Array.isArray(data) ? data : [data]);
        console.log(normalizedData)
        setScheduleItems(normalizedData);
        console.log(scheduleItems)
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      }
    };

    loadSchedule();
  }, []);

  useEffect(() => {
    connectSocket();

    const handleScheduleUpdated = (updatedSchedule) => {
      console.log('Расписание обновлено через сокет:', updatedSchedule);
      const normalizedData = normalizeScheduleData(Array.isArray(updatedSchedule) ? updatedSchedule : [updatedSchedule]);
      setScheduleItems(prev => {
        const updatedItem = normalizedData[0];
        const exists = prev.some(item => item.id === updatedItem.id);
        return exists
          ? prev.map(item => item.id === updatedItem.id ? updatedItem : item)
          : [...prev, updatedItem];
      });
    };

    onScheduleUpdated(handleScheduleUpdated);

    return () => {
      offScheduleUpdated(handleScheduleUpdated);
      disconnectSocket();
    };
  }, []);

  // Преобразовать "Пн" → дата "2024-04-29"
  function getDateFromDayName(dayName) {
    const today = new Date();
    const todayIndex = today.getDay() === 0 ? 7 : today.getDay(); // в JS воскресенье = 0
    const targetIndex = days.indexOf(dayName) + 1;

    const diff = targetIndex - todayIndex;
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + diff);

    return format(targetDate, 'yyyy-MM-dd');
  }

  // Расчитать окончание пары (+90 минут)
  function getEndTime(startHour) {
    const parsed = parseISO(`1970-01-01T${startHour}:00`);
    const endTime = addMinutes(parsed, 90); // занятие длится 90 минут
    return format(endTime, 'HH:mm:ss');
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedItem = scheduleItems.find(item => item.id === active.id);
    if (!draggedItem) return;

    const droppableData = over.data?.current;
    if (!droppableData) return;

    const { day, cabinet, hour } = droppableData;

    // Переводим дату в нужный формат
    const dayDate = getDateFromDayName(day);

    const updatedItem = {
      ...draggedItem,
      day: dayDate,             // дата типа "2024-04-30"
      cabinet: cabinet.replace('Каб ', ''),
      timeStart: hour + ':00',   // добавляем секунды
      timeEnd: getEndTime(hour), // рассчитываем окончание пары
    };

    const updatedSchedule = scheduleItems.map(item =>
      item.id === draggedItem.id ? updatedItem : item
    );

    setScheduleItems(updatedSchedule);

    try {
      await updateScheduleItem(updatedItem);
      console.log('Успешно обновлено на сервере!');
    } catch (error) {
      console.error('Ошибка при обновлении на сервере:', error);
    }
  };


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
      <DndContext onDragEnd={handleDragEnd}>
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
                  const item = scheduleItems.find(
                    (i) => i.day === day && i.cabinet === cabinet && i.time === hour
                  );

                  return (
                    <CalendarCell
                      key={`${rowIndex}-${day}-${cabinet}`}
                      day={day}
                      cabinet={cabinet}
                      hour={hour}
                    >
                      {item && <ScheduleItem item={item} />}
                    </CalendarCell>
                  );
                })
              )}
            </React.Fragment>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
