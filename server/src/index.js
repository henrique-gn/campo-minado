import webserver from './infra/webserver.js';

async function main() {
  const instance = webserver.create();
  instance.start();
}

main();
