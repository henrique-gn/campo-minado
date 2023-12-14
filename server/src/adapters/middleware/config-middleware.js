import express from 'express';
import morgan from 'morgan';

function apply(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
}

export default Object.freeze({
  apply,
});
