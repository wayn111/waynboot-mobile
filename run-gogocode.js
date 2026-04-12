const { spawn } = require('child_process');

const ls = spawn('npx', ['gogocode', '-s', './src', '-t', 'gogocode-plugin-vue', '-o', './src'], { shell: true });

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  if (data.includes('source path and output path is same')) {
      ls.stdin.write('y\n');
  }
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
