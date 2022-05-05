export function View () {
  this.counterEventForm = document.querySelector('.counter-event__form');
  this.eventsListHtml = document.querySelector('.counter-event__list');
}

View.prototype = {
  constructor: View,

  bindAddEvent (handler) {
    this.counterEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      handler(data);
      e.target.reset();
    });
  },

  bindDeleteEvent (handler) {
    this.eventsListHtml.addEventListener('click', (e) => {
      if (!e.target.classList.contains('counter-event__button')) return;
      const idEvent = e.target.parentNode.id;
      handler(idEvent);
    });
  },

  addEvent (event) {
    if (this.eventsListHtml.querySelector('.counter-event__default-msg')) {
      this.eventsListHtml.innerHTML = '';
    }
    const newEvent = this.createEvent(event);
    this.eventsListHtml.appendChild(newEvent);
  },

  deleteEvent ({ id }) {
    const eventToDelete = document.querySelector(`li[id="${id}"]`);
    const that = this;
    setTimeout(function () {
      eventToDelete.classList.add('couter-event__item-delated');
      eventToDelete.onanimationend = function () {
        eventToDelete.remove();
      };
      if (that.eventsListHtml.querySelector('li')) {
        // for take time to end the last animation
        setTimeout(() => that.renderDefaultMessage('No more events 😃'), 400);
      }
    }, 200);
  },

  createEvent ({ id, title, date, daysForEvent }) {
    const liItem = document.createElement('li');
    const daysLabel = daysForEvent === 1 || daysForEvent === -1
      ? 'day'
      : daysForEvent
        ? 'days'
        : '';
    liItem.innerHTML = `
      <li class="couter-event__item" id=${id}>
        <p class="counter-event__days"><span>${Math.abs(daysForEvent) || 'Today'}</span> ${daysLabel} ${daysForEvent >= 0 ? '' : 'ago'}</p>
        <p class="counter-event__name">${title}</p>
        <p class="counter-event__date">${date}</p>
        <button type="button" class="counter-event__button">Eliminar</button>
      </li>
    `;
    return liItem;
  },

  renderDefaultMessage (textMessage) {
    const messageElement = document.createElement('h2');
    messageElement.classList.add('counter-event__default-msg');
    messageElement.innerText = textMessage;
    this.eventsListHtml.appendChild(messageElement);
  },

  renderInitialEvents (events) {
    if (!events.length) {
      this.renderDefaultMessage('Not Events yet 😀');
      return;
    };
    const fragmnet = document.createDocumentFragment();
    events.forEach(event => fragmnet.appendChild(this.createEvent(event)));
    this.eventsListHtml.appendChild(fragmnet);
  }
};
