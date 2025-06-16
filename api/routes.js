import { Router } from "express";

import translationRouter from './routes/translationRouter.js';

const routes = Router();

routes.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send('OK');
});

routes.use('/translations', translationRouter);

export default routes;
