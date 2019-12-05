var spawn = require('child_process').spawn;
let srcFile = './input.js'

spawn('node', [srcFile], {
  cwd: __dirname,
  stdio: 'inherit'
});