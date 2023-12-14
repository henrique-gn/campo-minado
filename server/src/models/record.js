import { randomUUID } from 'node:crypto';
import validator from './validator.js';
import database from '../infra/database.js';

async function list() {
  const records = await database.record.findMany();
  sortRecords();

  return records;

  function sortRecords() {
    records.sort((a, b) => {
      const aPoints = a.points * getDifficultyMultiplier(a.difficulty);
      const bPoints = b.points * getDifficultyMultiplier(b.difficulty);
      return bPoints - aPoints;
    });

    function getDifficultyMultiplier(difficulty) {
      if (difficulty == 2) return 1.3;
      if (difficulty == 3) return 1.5;
    }
  }
}

async function persist(record) {
  const foundRecord = await findByUsername(record.username);

  if (foundRecord) {
    await update(foundRecord.id, record);
  } else {
    await create(record);
  }
}

async function findByUsername(username) {
  if (!username) return null;

  const record = await database.record.findUnique({
    where: {
      username,
    },
  });

  return record;
}

async function create(record) {
  const cleanValues = validator.parseRecord(record);
  cleanValues.id = randomUUID();
  await database.record.create({
    data: cleanValues,
  });
}

async function update(recordId, record) {
  await database.record.update({
    where: {
      id: recordId,
    },
    data: {
      points: record.points,
      difficulty: record.difficulty,
    },
  });
}

export default Object.freeze({
  list,
  persist,
});
