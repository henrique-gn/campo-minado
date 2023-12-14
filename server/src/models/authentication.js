import environment from '#root/infra/environment.js';

function verifyApiKey(request) {
  return request.headers['x-api-key'] === environment.API_KEY;
}

export default Object.freeze({
  verifyApiKey,
});
