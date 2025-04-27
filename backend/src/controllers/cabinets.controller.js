const { pool } = require('../config/db');

// Получить список всех кабинетов
exports.getCabinets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cabinets ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения кабинетов:', err);
    res.status(500).json({ error: 'Ошибка получения кабинетов' });
  }
};

// Создать новый кабинет
exports.createCabinet = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Название кабинета обязательно' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO cabinets (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка создания кабинета:', err);
    res.status(500).json({ error: 'Ошибка создания кабинета' });
  }
};

// Обновить название кабинета
exports.updateCabinet = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Название кабинета обязательно' });
  }

  try {
    const result = await pool.query(
      'UPDATE cabinets SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Кабинет не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления кабинета:', err);
    res.status(500).json({ error: 'Ошибка обновления кабинета' });
  }
};

// Удалить кабинет
exports.deleteCabinet = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM cabinets WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Кабинет не найден' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Ошибка удаления кабинета:', err);
    res.status(500).json({ error: 'Ошибка удаления кабинета' });
  }
};
