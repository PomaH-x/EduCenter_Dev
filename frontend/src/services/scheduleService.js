// src/services/scheduleService.js
import { fetchWithAuth } from './apiService';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchSchedule() {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Ошибка загрузки расписания');
  }
  return await response.json();
}

// Для будущих операций CRUD:
export async function createScheduleItem(itemData) {
  return fetchWithAuth('/schedule', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}

// Обновление отдельного элемента расписания
export async function updateScheduleItem(updatedItem) {
  try {
    const preparedItem = {
      user_id: updatedItem.userId ?? null,           // нижнее подчёркивание
      day: updatedItem.day,                          // "YYYY-MM-DD"
      time_start: updatedItem.timeStart,             // нижнее подчёркивание
      time_end: updatedItem.timeEnd,                 // нижнее подчёркивание
      cabinet: parseInt(updatedItem.cabinet),        // число
    };

    const token = getToken();
    console.log('preparedItem для обновления:', preparedItem);
    const response = await fetch(`${API_URL}/api/schedule/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(preparedItem),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка от сервера:', errorData);
      throw new Error('Ошибка обновления расписания');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении элемента расписания:', error);
    throw error;
  }
}


export async function deleteScheduleItem(id) {
  return fetchWithAuth(`/schedule/${id}`, {
    method: 'DELETE',
  });
}


