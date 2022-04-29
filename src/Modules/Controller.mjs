export function Controller (model, view) {
  this.model = model;
  this.view = view;
}

Controller.prototype = {
  constructor: Controller

};
