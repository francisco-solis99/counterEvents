export function Model () {
  this.eventsList = JSON.parse(localStorage.getItem('events')) ?? [];
  this.actionToBind = null;
}

Model.prototype = {
  constructor: Model,

  addEvent (title, date) {
    const daysForEvent = this.getDaysLeftForEvent(date);
    const event = {
      id: this.eventsList.length ? this.eventsList[this.eventsList.length - 1].id + 1 : 0,
      title,
      date,
      daysForEvent
    };
    this.eventsList.push(event);
    this.saveEventsList();
    this.actionToBind('addEvent', { ...event });
  },

  updateDates () {
    if (!this.eventsList.length) return;
    this.eventsList.forEach(event => {
      event.daysForEvent = this.getDaysLeftForEvent(event.date);
    });
    this.saveEventsList();
  },

  getDaysLeftForEvent (date) {
    const MS_TODAYS = 1000 * 60 * 60 * 24;
    const todayMs = new Date(new Date(Date.now()).toDateString()).getTime();
    const eventMs = Date.parse(date);
    console.log(todayMs, eventMs);
    const daysLeft = Math.ceil((eventMs - todayMs) / MS_TODAYS);
    console.log(eventMs, daysLeft);
    return daysLeft;
  },

  getEvents () {
    return [...this.eventsList];
  },

  getEventIndexById (id) {
    return this.eventsList.findIndex(element => element.id === +id);
  },

  deleteEvent (id) {
    const index = this.getEventIndexById(id);
    const eventRemoved = this.eventsList[index];
    this.eventsList.splice(index, 1);
    this.saveEventsList();
    this.actionToBind('deleteEvent', { ...eventRemoved });
  },

  saveEventsList () {
    localStorage.setItem('events', JSON.stringify([...this.eventsList]));
  },

  bindEventsChanges (callback) {
    this.actionToBind = callback;
  }
};
