import { Router } from "express";

import translationRouter from './routes/translationRouter.js';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('OK');
});

routes.use('/translations', translationRouter);

export default routes;
