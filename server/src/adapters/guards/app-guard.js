import authentication from '#root/models/authentication.js';

async function appGuard(req, res, next) {
  try {
    const apiKeyMatch = authentication.verifyApiKey(req);

    if (apiKeyMatch) {
      return next();
    }

    throw new UnauthorizedError({
      action: 'Verifique sua chave de API',
      message: 'Chave de API inválida',
      errorLocationCode: 'INFRA:WEBSERVER:ROUTE:INVALID_API_KEY',
    });
  } catch (error) {
    next(error);
  }
}

function guard(app) {
  app.use((req, res, next) => {
    appGuard(req, res, next);
  });
}

export default Object.freeze({
  guard,
});
