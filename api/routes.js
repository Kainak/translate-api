import { Router } from "express";
import swagger from 'swagger-ui-express';

import swaggerConfig from './config/swagger.json' assert { type: 'json' };
import translationController from './controllers/translationController.js';

const routes = Router();

routes.use('/docs', swagger.serve, swagger.setup(swaggerConfig));

routes.get('/', (req, res) => res.send('Tá funcionando!'));

routes.post('/translations', translationController.createTranslation);
routes.get('/translations/:requestId', translationController.getTranslationStatus);

export default routes;
