var spawn = require('child_process').spawn;
let srcFile = './input.js'

console.log('spawn')
console.log(spawn)

spawn('node', [srcFile], {
  cwd: __dirname,
  stdio: 'inherit'
});