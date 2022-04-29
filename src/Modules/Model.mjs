export function Model () {
  this.eventsList = localStorage.getItem('events') ?? [];
}

Model.prototype = {
  constructor: Model
};
