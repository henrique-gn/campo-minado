import { faker } from '@faker-js/faker';
import consumer from './consumer.js';
import environment from '#root/infra/environment.js';
import database from '#root/infra/database.js';

const key = environment.API_KEY;

async function persistRecord(override = {}, apiKey = key) {
  try {
    const record = generateRecord(override);
    const response = await consumer.post('/records', record, insertHeaders(apiKey));

    return response;
  } catch (error) {
    throw filterAxiosError(error);
  }
}

async function listRecords(apiKey = key) {
  try {
    const response = await consumer.get('/records', insertHeaders(apiKey));
    return response;
  } catch (error) {
    throw filterAxiosError(error);
  }
}

function generateRecord(override = {}) {
  const username = faker.person.firstName().toLowerCase();
  const points = faker.number.int({ min: 0, max: 100 });
  const difficulty = faker.number.int({ min: 1, max: 3 });
  return { username, points, difficulty, ...override };
}

function generateManyRecords(quantity, override = []) {
  const records = [];
  for (let i = 0; i < quantity; i++) {
    records.push(generateRecord(override));
  }
  return records;
}

function filterAxiosError(err) {
  const errorToReturn = new Error();
  errorToReturn.message = err.response.data.message;
  errorToReturn.status = err.response.status;
  errorToReturn.stack = err.stack;
  return errorToReturn;
}

function insertHeaders(apiKey) {
  return {
    headers: {
      'x-api-key': apiKey,
    },
  };
}

async function dropAllRecords() {
  await database.record.deleteMany({});
}

export default Object.freeze({
  persistRecord,
  listRecords,
  generateRecord,
  generateManyRecords,
  dropAllRecords,
});
