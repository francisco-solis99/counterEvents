import { Controller } from './Modules/Controller.mjs';
import { Model } from './Modules/Model.mjs';
import { View } from './Modules/View.mjs';

const app = new Controller(new Model(), new View());

console.log(app);

// app.model.addEvent('Make cookies', '2022-05-05');
// console.log(app.model.getEvents());

/*
  TODO: Things to do
  -> Use the Drag and drop API
  -> Filter the events in events passed and events to will pass
*/
