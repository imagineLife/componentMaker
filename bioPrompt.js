'use strict';
var inquirer = require('inquirer');

const printText = txt => console.log(JSON.stringify(txt, null, '  '));

var questions = [
  {
    type: 'editor',
    name: 'bio',
    message: 'Please write a short bio of at least 3 lines.',
    validate: function(text) {
      if (text.split('\n').length < 3) {
        return 'Must be at least 3 lines.';
      }
      return true;
    }
  }
];

inquirer.prompt(questions).then(printText);