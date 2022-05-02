export function Controller (model, view) {
  this.model = model;
  this.view = view;

  // init listeners and pass the callback to do something in the model
  this.view.bindAddEvent(this.handlerAddEvent.bind(this));
  this.view.bindDeleteEvent(this.handlerDeleteEvent.bind(this));

  // bind with model to change in teh UI
  this.model.bindEventsChanges(this.onEventsChanges.bind(this));

  // render the initial events if exist
  this.view.renderInitialEvents(this.model.getEvents());
}

Controller.prototype = {
  constructor: Controller,

  handlerAddEvent ({ title, date }) {
    this.model.addEvent(title, date);
  },

  handlerDeleteEvent (idEvent) {
    this.model.deleteEvent(idEvent);
  },

  onEventsChanges (action, event) {
    if (action === 'addEvent') return this.view.addEvent(event);
    if (action === 'deleteEvent') return this.view.deleteEvent(event);
    return console.info('Check your request action and try again 😀');
  }

};
