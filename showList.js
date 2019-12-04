/**
 * List prompt example
 */

'use strict';
var inquirer = require('inquirer');


//helper fns
const logAnswers = answers => console.log(JSON.stringify(answers, null, '  '))
const filterFn = val => val.toLowerCase();

//data
const pizzaSizes = ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro']
let separator = new inquirer.Separator()
let toDoChoices = [
  'Order a pizza',
  'Make a reservation',
  'Ask for opening hours',
  {
    name: 'Contact support',
    disabled: 'Unavailable at this time'
  },
  'Talk to the receptionist'
]

//add a line-separator
toDoChoices.splice(2, 0, separator)

inquirer
  .prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: toDoChoices
    },
    {
      type: 'list',
      name: 'size',
      message: 'What size do you need?',
      choices: pizzaSizes,
      filter: filterFn
    }
  ])
  .then(logAnswers);