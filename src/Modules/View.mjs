export function View () {
  this.counterEventForm = document.querySelector('.counter-event__form');
  this.eventsListHtml = document.querySelector('.counter-event__list');
  this.areEvents = false;
  this.currentItem = null;
  this.orderToBind = null;
}

View.prototype = {
  constructor: View,

  // binders to the events
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

  bindViewsEvents (handler) {
    const viewsContainer = document.querySelector('.counter-event__resume-views');
    viewsContainer.addEventListener('click', (e) => {
      if (e.target.type === 'radio') {
        const labelToFilter = e.target.value;
        handler(labelToFilter);
      }
    });
  },

  bindDragAndDropItems () {
    const eventItems = this.getEventItems();
    eventItems.forEach(item => {
      this.addDragAndDropListeners(item);
    });
  },

  addDragAndDropListeners (element) {
    element.addEventListener('dragstart', this.dragAndDropActions('handlerDragStart').bind(this));
    element.addEventListener('dragend', this.dragAndDropActions('handlerDragEnd'));
    element.addEventListener('dragover', this.dragAndDropActions('handlerDragOver'));
    element.addEventListener('drop', this.dragAndDropActions('handlerDrop').bind(this));
    element.addEventListener('dragenter', this.dragAndDropActions('handlerDragEnter'));
    element.addEventListener('dragleave', this.dragAndDropActions('handlerDragLeave'));
  },

  bindUpdateOrder (callback) {
    this.orderToBind = callback;
  },

  getEventItems () {
    const events = document.querySelectorAll('li.couter-event__item');
    return events;
  },

  dragAndDropActions (action) {
    const actions = {
      handlerDragStart (e) {
        e.target.classList.add('isDrag');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        this.currentItem = e.target;
      },

      handlerDragEnd (e) {
        e.target.classList.remove('isDrag');
      },

      handlerDragOver (e) {
        e.preventDefault();
        e.stopPropagation();
      },

      handlerDrop (e) {
        e.target.style.background = 'transparent';
        const data = e.dataTransfer.getData('text/html');
        if (e.target !== this.currentItem && e.target.classList.contains('couter-event__item')) {
          this.currentItem.innerHTML = e.target.innerHTML;
          e.target.innerHTML = data;
        }
        const items = [...this.eventsListHtml.querySelectorAll('.counter-event__name')];
        const titleItemsOrder = items.map(item => item.textContent);
        this.orderToBind(titleItemsOrder);
      },

      handlerDragEnter (e) {
        e.target.style.background = 'hsl(234deg 39% 55%)';
      },

      handlerDragLeave (e) {
        e.target.style.background = 'transparent';
      }
    };
    return actions[action];
  },

  // actions to render
  addEvent (event) {
    if (this.eventsListHtml.querySelector('.counter-event__default-msg')) {
      this.eventsListHtml.innerHTML = '';
    }
    const newEvent = this.createEvent(event);
    this.addDragAndDropListeners(newEvent);
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
      if (!that.eventsListHtml.querySelector('li')) {
        // for take time to end the last animation
        setTimeout(() => that.renderDefaultMessage('No more events 😃'), 400);
        that.areEvents = false;
      }
    }, 200);
  },

  createEvent ({ id, title, date, daysForEvent }) {
    const liItem = document.createElement('li');
    liItem.id = id;
    liItem.classList.add('couter-event__item');
    liItem.draggable = 'true';
    const daysLabel = daysForEvent === 1 || daysForEvent === -1
      ? 'day'
      : daysForEvent
        ? 'days'
        : '';
    liItem.innerHTML = `
        <p class="counter-event__days"><span>${Math.abs(daysForEvent) || 'Today'}</span> ${daysLabel} ${daysForEvent >= 0 ? '' : 'ago'}</p>
        <p class="counter-event__name">${title}</p>
        <p class="counter-event__date">${date}</p>
        <button type="button" class="counter-event__button">Eliminar</button>
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
    this.areEvents = true;
    const fragmnet = document.createDocumentFragment();
    events.forEach(event => fragmnet.appendChild(this.createEvent(event)));
    this.eventsListHtml.appendChild(fragmnet);
  },

  renderResumeEvents ({ allEvents, nextEvents, passedEvents }) {
    const resume = document.createElement('div');
    resume.classList.add('counter-event__resume');
    resume.innerHTML = `
      <span class="counter-event__resume-total">${allEvents.length} total events</span>
      <div class="counter-event__resume-views">
        <label for="view1" class="view-label">
          <input type="radio" name="resume-views" id="view1" value="allEvents"  checked>
          <span>All events</span>
        </label>

        <label for="view2" class="view-label">
          <input type="radio" name="resume-views" id="view2" value="passedEvents" >
          <span>Passed Events</span>
        </label>

        <label for="view3" class="view-label">
          <input type="radio" name="resume-views" id="view3" value="nextEvents" >
          <span>Next Events</span>
        </label>
      </div>
      <div class="counter-event__resume-stats">
        <span class="counter-event__resume-stat"><mark>${nextEvents.length} events will pass</mark></span>
        <span class="counter-event__resume-stat"><mark>${passedEvents.length} events passed</mark></span>
      </div>
    `;
    document.querySelector('main').appendChild(resume);
  },

  updateResume ({ allEvents, nextEvents, passedEvents }) {
    const resume = document.querySelector('.counter-event__resume');
    // update values
    resume.querySelector('.counter-event__resume-total').textContent = allEvents.length + ' total events';
    resume.querySelector('.counter-event__resume-stat:first-child mark').textContent = nextEvents.length + ' events will pass';
    resume.querySelector('.counter-event__resume-stat:last-child mark').textContent = passedEvents.length + ' events passed';
  },

  renderFilterEvents (filterEvents) {
    const currentEventsOnScreen = this.eventsListHtml.querySelectorAll('li.couter-event__item');
    const idEventsToFilter = filterEvents.map(event => event.id);
    console.log(currentEventsOnScreen);
    console.log(idEventsToFilter);
    currentEventsOnScreen.forEach(event => {
      if (idEventsToFilter.includes(+event.id)) {
        event.style.display = 'flex';
        return;
      }
      // event.classList.add('couter-event__item-delated');
      // event.style.display = 'none';
      console.log('oculto para el evento => ' + event.id);
      setTimeout(function () {
        event.classList.add('couter-event__item-delated');
        event.onanimationend = function (e) {
          if (e.animationName === 'fadeOut') {
            event.style.display = 'none';
            event.classList.remove('couter-event__item-delated');
          }
        };
      }, 100);
    });
  }
};
