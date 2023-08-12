const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Kriteria 1 : Aplikasi menggunakan port 9000
// Kriteria 2 : Aplikasi dijalankan dengan perintah npm run start.
const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init().then(() => {});