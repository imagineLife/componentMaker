/**
 * List prompt example
 */

'use strict';
var inquirer = require('inquirer');


const logAnswers = answers => console.log(JSON.stringify(answers, null, '  '))
const filterFn = val => val.toLowerCase();

inquirer
  .prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Order a pizza',
        'Make a reservation',
        new inquirer.Separator(),
        'Ask for opening hours',
        {
          name: 'Contact support',
          disabled: 'Unavailable at this time'
        },
        'Talk to the receptionist'
      ]
    },
    {
      type: 'list',
      name: 'size',
      message: 'What size do you need?',
      choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
      filter: filterFn
    }
  ])
  .then(logAnswers);