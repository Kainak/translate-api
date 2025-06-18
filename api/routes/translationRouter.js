import { Router } from 'express';
import translationController from '../controllers/translationController.js';

const translationRouter = Router();

translationRouter.post('/', translationController.createTranslation);


translationRouter.get('/:requestId', translationController.getTranslationStatus);

export default translationRouter; 