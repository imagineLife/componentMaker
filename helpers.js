const hzLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);
}

const verticalSpace = function(lineCount){
  lineCount = typeof(lineCount) == 'number' && lineCount > 0 ? lineCount : 1;
  for (i = 0; i < lineCount; i++) {
      console.log('');
  }
}

const logTheData = obj => {
  for(var key in obj){
     if(obj.hasOwnProperty(key)){
        var value = obj[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        verticalSpace();
     }
  }
}

const compFromName = (compName) => {
let str = 
`import React from 'react';

const ${compName} = () => (<p>${compName}</p>);

export default ${compName};`

}

module.exports = {hzLine, verticalSpace, compFromName}