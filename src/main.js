import { Controller } from './Modules/Controller.mjs';
import { Model } from './Modules/Model.mjs';
import { View } from './Modules/View.mjs';

const app = new Controller(new Model(), new View());
