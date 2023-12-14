import express from 'express';
import environment from './environment.js';
import recordController from '#root/adapters/controllers/record-controller.js';
import errorMiddleware from '#root/adapters/middleware/error-middleware.js';
import appGuard from '#root/adapters/guards/app-guard.js';
import configMiddleware from '#root/adapters/middleware/config-middleware.js';

function create() {
  const app = express();

  setupConfiguration(app);
  setupRoutes(app);

  return { start };

  function start() {
    const port = environment.PORT || 8080;
    const host = environment.HOST || 'localhost';

    app.listen(port, () => console.log(`HTTP Server listening at http://${host}:${port}`));
  }
  function setupConfiguration(app) {
    configMiddleware.apply(app);
  }

  function setupRoutes(app) {
    applyGuard();
    applyProtectedRoutes();
    applyErrorHandlers();

    function applyGuard() {
      appGuard.guard(app);
    }

    function applyProtectedRoutes() {
      recordController.route(app);
    }

    function applyErrorHandlers() {
      errorMiddleware.apply(app);
    }
  }
}

export default Object.freeze({
  create,
});
