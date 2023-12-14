import { ValidationError } from '../errors/index.js';

function parseRecord(record) {
  cleanUndefinedValues(record);

  if (!record.username) {
    throw new ValidationError({
      action: 'Verifique o nome de usuário',
      message: 'Nome de usuário é obrigatório',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:USERNAME_REQUIRED',
    });
  }

  if (record.username.length > 30) {
    throw new ValidationError({
      action: 'Verifique o nome de usuário',
      message: 'Nome de usuário deve ter no máximo 30 caracteres',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:USERNAME_LENGTH',
    });
  }

  if (!Number.isInteger(record.points)) {
    throw new ValidationError({
      action: 'Verifique os pontos',
      message: 'Pontos são obrigatórios',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:POINTS_REQUIRED',
    });
  }

  if (!Number.isInteger(record.difficulty)) {
    throw new ValidationError({
      action: 'Verifique a dificuldade',
      message: 'Dificuldade é obrigatória',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:DIFFICULTY_REQUIRED',
    });
  }

  if (record.difficulty < 1 || record.difficulty > 3) {
    throw new ValidationError({
      action: 'Verifique a dificuldade',
      message: 'Dificuldade deve ser um número entre 1 e 3',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:DIFFICULTY_RANGE',
    });
  }

  if (record.points < 0) {
    throw new ValidationError({
      action: 'Verifique os pontos',
      message: 'Pontos não podem ser negativos',
      errorLocationCode: 'MODEL:VALIDATOR:PARSE_RECORD:POINTS_NEGATIVE',
    });
  }

  return {
    username: record.username,
    points: record.points,
    difficulty: record.difficulty,
  };
}

function cleanUndefinedValues(obj) {
  for (const key in Object.keys(obj)) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
}

export default Object.freeze({
  parseRecord,
});
