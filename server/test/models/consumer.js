import axios from 'axios';
import environment from '#root/infra/environment.js';

const consumer = axios.create({
  baseURL: `http://${environment.HOST}:${environment.PORT}`,
});

export default consumer;
