// src/services/websocket.service.js
let ioInstance;

exports.setIOInstance = (io) => {
  ioInstance = io;
};

exports.emitScheduleUpdatedEvent = (schedule) => {
  if (ioInstance) {
    ioInstance.emit('schedule.updated', schedule);
  }
};