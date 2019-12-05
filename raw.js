/*
 * CLI-related tasks
 *
 */

 // Dependencies
 /*
	READLINE
	https://nodejs.org/docs/latest-v9.x/api/readline.html
	The readline module provides an interface 
	for reading data from a Readable stream 
	(such as process.stdin) one line at a time. 
*/

const readline = require('readline');

/*
	OS
	https://nodejs.org/api/os.html#os_os_freemem
	The os module provides operating system-related
	 utility methods and properties.
*/
const os = require('os')

/*
	v8
	https://nodejs.org/api/v8.html
	The v8 module exposes APIs that are specific
	to the version of V8 built into the Node.js binary. 
*/
const v8 = require('v8');
const util = require('util');
const fs = require('fs');
const path = require('path')
const events = require('events');
class _events extends events{};
const e = new _events();

const { hzLine, verticalSpace, logTheData } = require('./helpers')

const makeHeader = (str) => {
	hzLine();
  cli.centered(str);
  hzLine();
  verticalSpace(2);
}

const makeFooter = (spaceHeight) => {
	// Create a footer for the stats
  verticalSpace(spaceHeight);
  hzLine();
}

// Instantiate the cli module object
let cli = {};

// Input handlers
e.on('make',function(str){
  cli.responders.makeComponentFiles(str);
});

// Input handlers
e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('stats',function(str){
  cli.responders.stats();
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function(){
  // Codify the commands and their explanations
  var commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get statistics on the underlying operating system and resource utilization',
    'make --{ComponentName}': 'Creates a Component directory'
  };

  // Show a header for the help page that is as wide as the screen
  makeHeader('CLI MANUAL')

  // Show each command, followed by its explanation, in white and yellow respectively
  logTheData(commands)

  makeFooter(1);
};

// Stats
cli.responders.stats = function(){
  
  //stats obj
  let dataToSee = {
    /*
      loadavg
      Returns an array containing the 1, 5,
       and 15 minute load averages. The load
       average is a measure of system activity 
       calculated by the operating system and 
       expressed as a fractional number. The 
       load average is a Unix-specific concept. 
       On Windows, the return value is
        always [0, 0, 0].
    */
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
  }

  makeHeader('STATS')

  // Log out each stat
  logTheData(dataToSee)

  makeFooter();

};

// Exit
cli.responders.exit = function(){
  process.exit(0);
};

// List Users
cli.responders.recentUsers = function(){
  
  dataLib.listFiles(false, 'users', (err, userIds) => {
    if(!err && userIds && userIds.length > 0){

      verticalSpace()
      
      //loop through users
      userIds.forEach((userId, idx ,arr) => {
        dataLib.read('users',userId, (err,userData) => {
          if(!err && userData){

            //if made within a day, print to console
            let madeWithinADay = helpers.checkForRecentAddition(userData.dateCreated)
            if(madeWithinADay){
              let line = `Name: ${userData.firstName} ${userData.lastName}  Email: ${userData.email}`
              console.log(line)
              verticalSpace()
            }
          }
        })
      })
    }
  })
};



// More user info
cli.responders.moreUserInfo = function(str){
  
  //get ID from string
  let strArr = str.split('--')
  let emailAddress = typeof(strArr[1]) == 'string' && strArr[1].length > 0 ? strArr[1] : false;

  if(emailAddress){
    dataLib.read('users', emailAddress, (err,userData) => {
      if(!err && userData){
        //remove password
        delete userData.hashedPassword;

        //print json with text highlighted
        verticalSpace()
        console.dir(userData, {'colors': true});
      }
    })
  }
};

// More order info
cli.responders.makeComponentFiles = function(str){
  
  //get ID from string
  let strArr = str.split(' ')
  let componentName = typeof(strArr[1]) == 'string' && strArr[1].length > 0 ? strArr[1] : false;
  console.log('componentName')
  console.log(componentName)
};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};

// Create a horizontal line across the screen
hzLine;

// Input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if(str){
    // Codify the unique strings that identify the different unique questions allowed be the asked
    let uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'make'
    ];

    // Go through the possible inputs, emit event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if(!matchFound){
      console.log("Sorry, try again");
    }
  }
};

// Init logic

//start the cli interface
/*
	Instances of the readline.Interface class are constructed
	 using the readline.createInterface() method. Every instance
	 is associated with a single input Readable stream and
	 a single output Writable stream. The output stream is used 
	 to print prompts for user input that arrives on, 
	 and is read from, the input stream.
*/
// Send to console, in dark blue
console.log('\x1b[34m%s\x1b[0m','Make a component directory by name');

// Start the interface
let cliInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ''
});

// Create an initial prompt
cliInterface.prompt();

// Handle each line of input separately
cliInterface.on('line', function(str){
  // Send to the input processor
  cli.processInput(str);

  // Re-initialize the prompt afterwards
  /*
	The rl.prompt() method writes the readline.Interface 
	instances configured prompt to a new line in output in order to 
	provide a user with a new location at which to provide input.
		When called, rl.prompt() will resume the input stream if 
	it has been paused.
		If the readline.Interface was created with output set 
		to null or undefined the prompt is not written.
*/
  cliInterface.prompt();
});

// If the user stops the CLI, kill the associated process
cliInterface.on('close', function(){
  process.exit(0);
});

module.exports = cli;
