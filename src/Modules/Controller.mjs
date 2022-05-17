export function Controller (model, view) {
  this.model = model;
  this.view = view;

  // init listeners and pass the callback to do something in the model
  this.view.bindAddEvent(this.handlerAddEvent.bind(this));
  this.view.bindDeleteEvent(this.handlerDeleteEvent.bind(this));

  // bind with model to change in teh UI
  this.model.bindEventsChanges(this.onEventsChanges.bind(this));
  this.view.bindUpdateOrder(this.handlerDragAndDrop.bind(this));

  // render the initial events if exist
  this.handlerInitRender();

  // add the listeners for drag and drop feature for the initial events after render them
  this.view.bindDragAndDropItems();
}

Controller.prototype = {
  constructor: Controller,

  handlerAddEvent ({ title, date }) {
    this.model.addEvent(title, date);

    // update or creat the resume
    const events = this.model.getEvents();
    if (events.length === 1) {
      this.view.areEvents = true;
      this.view.renderResumeEvents(this.model.generateSeparetedEvents());
    } else {
      this.view.updateResume(this.model.generateSeparetedEvents());
    }
  },

  handlerDeleteEvent (idEvent) {
    this.model.deleteEvent(idEvent);
    this.view.updateResume(this.model.generateSeparetedEvents());
  },

  handlerFilterViews (label) {
    const separatedEvents = this.model.generateSeparetedEvents();
    const filterEvents = separatedEvents[label];
    this.view.renderFilterEvents(filterEvents);
  },

  handlerDragAndDrop (eventsTitles) {
    console.log('do something with model');
    this.model.reOrderEvents(eventsTitles);
  },

  onEventsChanges (action, event) {
    if (action === 'addEvent') return this.view.addEvent(event);
    if (action === 'deleteEvent') return this.view.deleteEvent(event);
    return console.info('Check your request action and try again 😀');
  },

  handlerInitRender () {
    this.model.updateDates();
    this.view.renderInitialEvents(this.model.getEvents());
    if (this.view.areEvents) {
      this.view.renderResumeEvents(this.model.generateSeparetedEvents());
      this.view.bindViewsEvents(this.handlerFilterViews.bind(this));
    }
  }

};
