import { Router } from 'express';
import translationController from '../controllers/translationController.js';

const translationRouter = Router();

/*  #swagger.tags = ['Translations']
    #swagger.summary = 'Submit a new translation request.'
    #swagger.description = 'Accepts a text string and a target language, then queues it for asynchronous processing.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateTranslationRequest" }
        }
      }
    }
    #swagger.responses[202] = {
      description: 'Request accepted and queued for processing.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateTranslationResponse" }
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Internal Server Error.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" }
        }
      }
    }
*/
translationRouter.post('/', translationController.createTranslation);

/*  #swagger.tags = ['Translations']
    #swagger.summary = 'Check the status of a translation request.'
    #swagger.description = 'Retrieves the current status and result of a translation request by its ID.'
    #swagger.parameters['requestId'] = {
      in: 'path',
      description: 'The unique ID of the translation request.',
      required: true,
      type: 'string',
      example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
    }
    #swagger.responses[200] = {
      description: 'The current status and result of the translation request.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/GetTranslationStatusResponse" }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Translation request not found.',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" }
        }
      }
    }
*/
translationRouter.get('/:requestId', translationController.getTranslationStatus);

export default translationRouter; 