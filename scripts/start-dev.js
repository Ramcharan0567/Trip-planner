import net from 'node:net';
import { spawn } from 'node:child_process';

const apiPort = Number(process.env.PORT || 3006);
const host = process.env.HOST || '127.0.0.1';

const apiPortState = await checkPort(apiPort, host);

if (apiPortState === 'open') {
  console.log(`API port ${apiPort} is already in use, so npm start will reuse the existing server and launch only the client.`);
  runCommand('npm', ['run', 'dev:client']);
} else {
  runCommand('npx', ['concurrently', '-k', 'npm:dev:server', 'npm:dev:client']);
}

function checkPort(port, hostname) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: hostname });

    socket.once('connect', () => {
      socket.end();
      resolve('open');
    });

    socket.once('error', () => {
      resolve('closed');
    });
  });
}

function runCommand(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
