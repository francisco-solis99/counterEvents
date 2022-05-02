import { Controller } from './Modules/Controller.mjs';
import { Model } from './Modules/Model.mjs';
import { View } from './Modules/View.mjs';

const app = new Controller(new Model(), new View());

console.log(app);

// app.model.addEvent('Make cookies', '2022-05-05');
// console.log(app.model.getEvents());
