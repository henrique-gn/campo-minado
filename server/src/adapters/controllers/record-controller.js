import record from '#root/models/record.js';

async function listRecords(req, res, next) {
  try {
    const records = await record.list();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

async function persistRecord(req, res, next) {
  try {
    await record.persist(req.body);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

function route(app) {
  app.get('/records', listRecords);
  app.post('/records', persistRecord);
}

export default Object.freeze({
  route,
});
