'use strict';
var inquirer = require('inquirer');
var chalkPipe = require('chalk-pipe');

const printResults = answers => console.log(JSON.stringify(answers, null, '  '))
const transformColor = function(color, answers, flags) {
  const text = chalkPipe(color)(color);
  if (flags.isFinal) {
    return text + '!';
  }

  return text;
}

const validatePhoneNumber = function(value) {
  var pass = value.match(
    /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
  );
  if (pass) {
    return true;
  }

  return 'Please enter a valid phone number';
}

const defaultFirstName = () => 'Water'
const defaultLastName = () => 'Melon'


const questions = [
  {
    type: 'input',
    name: 'first_name',
    message: "What's your first name",
    default: defaultFirstName
  },
  {
    type: 'input',
    name: 'last_name',
    message: "What's your last name",
    default: defaultLastName
  },
  {
    type: 'input',
    name: 'fav_color',
    message: "What's your favorite color",
    transformer: transformColor
  },
  {
    type: 'input',
    name: 'phone',
    message: "What's your phone number",
    validate: validatePhoneNumber
  }
]

inquirer.prompt(questions).then(printResults);