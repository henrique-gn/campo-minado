import { describe, it } from 'node:test';
import orchestrator from '../models/orchestrator.js';
import assert from 'node:assert';

describe('Teste de ponta a ponta de registros', () => {
  it('deve retornar 401 quando a chave da API não é fornecida', async () => {
    const listAttempt = () =>
      orchestrator.listRecords().catch((e) => assert.strictEqual(e.status, 401));
    const createAttempt = () =>
      orchestrator.persistRecord().catch((e) => assert.strictEqual(e.status, 401));

    const attempts = [listAttempt(), createAttempt()];

    await Promise.all(attempts);
  });
  it('deve retornar 400 quando as propriedades não são válidas', async () => {
    const createWithoutUsernameAttempt = () =>
      orchestrator.persistRecord({ username: '' }).catch((e) => assert.strictEqual(e.status, 400));

    const createWithLargerUsernameAttempt = () =>
      orchestrator
        .persistRecord({ username: 'usernamewithmorethanthirtycharacters' })
        .catch((e) => assert.strictEqual(e.status, 400));

    const createWithInvalidPointsAttempt = () =>
      orchestrator.persistRecord({ points: -1 }).catch((e) => assert.strictEqual(e.status, 400));

    const attempts = [
      createWithoutUsernameAttempt(),
      createWithLargerUsernameAttempt(),
      createWithInvalidPointsAttempt(),
    ];

    await Promise.all(attempts);
  });

  it('deve criar um registro', async () => {
    const username = 'testing-username' + Date.now();
    await orchestrator.persistRecord({ username, points: 10, difficulty: 2 });
    const listResponse = await orchestrator.listRecords();
    const records = listResponse.data;
    const createdRecord = records.find((r) => r.username === username);
    assert.strictEqual(createdRecord.points, 10);
    assert.strictEqual(createdRecord.difficulty, 2);
  });

  it('deve atualizar um registro', async () => {
    const username = 'testing-username' + Date.now();
    await orchestrator.persistRecord({ username, points: 10, difficulty: 2 });
    await orchestrator.persistRecord({ username, points: 20, difficulty: 3 });
    const listResponse = await orchestrator.listRecords();

    const records = listResponse.data;
    const createdRecord = records.find((r) => r.username === username);
    assert.strictEqual(createdRecord.points, 20);
    assert.strictEqual(createdRecord.difficulty, 3);
  });

  describe('listagem de registros', async () => {
    const recordsToPersist = orchestrator.generateManyRecords(4);
    const persistRequests = recordsToPersist.map((r) => orchestrator.persistRecord(r));
    await Promise.all(persistRequests);

    const listResponse = await orchestrator.listRecords();
    const records = listResponse.data;

    it('deve retornar os registros criados', () => {
      const createdRecords = records.filter((r) =>
        recordsToPersist.some((rp) => rp.username === r.username)
      );
      assert.strictEqual(createdRecords.length, recordsToPersist.length);
    });

    it('deve retornar os registros ordenados por pontos e dificuldade', () => {
      const orderedRecords = sortRecords(records);
      assert.deepStrictEqual(records, orderedRecords);

      function sortRecords(records) {
        records.sort((a, b) => {
          const aPoints = a.points * getDifficultyMultiplier(a.difficulty);
          const bPoints = b.points * getDifficultyMultiplier(b.difficulty);
          return bPoints - aPoints;
        });

        function getDifficultyMultiplier(difficulty) {
          if (difficulty == 2) return 1.3;
          if (difficulty == 3) return 1.5;
        }

        return records;
      }
    });
  });
});
