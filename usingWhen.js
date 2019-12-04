/**
 * When example
 */

'use strict';
var inquirer = require('inquirer');

const processAnswers = answers => console.log(JSON.stringify(answers, null, '  '));

const likesFood = aFood => answers => answers[aFood]

const doesntLikeFood = foodType => answers => !likesFood(foodType)(answers);

var questions = [
  {
    type: 'confirm',
    name: 'bacon',
    message: 'Do you like bacon?'
  },
  {
    type: 'input',
    name: 'favorite',
    message: 'Bacon lover, what is your favorite type of bacon?',
    when: function(answers) {
      return answers.bacon;
    }
  },
  {
    type: 'confirm',
    name: 'pizza',
    message: 'Ok... Do you like pizza?',
    when: answers => doesntLikeFood('bacon')
  },
  {
    type: 'input',
    name: 'favorite',
    message: 'Whew! What is your favorite type of pizza?',
    when: likesFood('pizza')
  }
];

inquirer.prompt(questions).then(processAnswers);