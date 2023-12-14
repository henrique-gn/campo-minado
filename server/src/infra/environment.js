import { config } from 'dotenv';

config();

export default Object.freeze({
  PORT: process.env.PORT,
  API_KEY: process.env.API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  HOST: process.env.HOST,
});
