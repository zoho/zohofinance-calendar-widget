const { exec } = require('child_process');
const path = require('path');

function updateWidget() {
  
  console.log('Moving Dist to widget/app ');
  
  let childProcess = exec(`rm -rf widget/app && cp -r dist/ widget/app`);
  childProcess.stderr.on('err', err => {
    throw Error(err);
  });
  childProcess.on('close', () => {
    console.log('Dist moved to widget/app');
  });
}

updateWidget();



