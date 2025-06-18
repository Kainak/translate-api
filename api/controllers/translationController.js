import { randomUUID } from 'crypto';
import httpStatus from 'http-status';
import Translation from '../models/translationModel.js';
import Publisher from '../services/publish.js';

const TRANSLATION_QUEUE = 'translation_queue';

const createTranslation = async (req, res) => {
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
  const { text, to } = req.body;
  const requestId = randomUUID();

  try {
    const publisher = new Publisher();
    await publisher.start();

    const translation = await Translation.create({
      requestId,
      originalText: text,
      sourceLanguage: 'en', // Mocked for now
      targetLanguage: to,
      status: 'queued',
    });

    const message = {
      requestId,
      text,
      to,
    };
    await publisher.publish(TRANSLATION_QUEUE, JSON.stringify(message));

    return res.status(httpStatus.ACCEPTED).json({
      requestId,
      status: translation.status,
    });
  } catch (error) {
    console.error('Error creating translation request', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to queue translation request' });
  }
};

const getTranslationStatus = async (req, res) => {
  
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
  const { requestId } = req.params;

  try {
    const translation = await Translation.findOne({ requestId });

    if (!translation) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Translation request not found' });
    }

    const response = {
      requestId: translation.requestId,
      status: translation.status,
      createdAt: translation.createdAt,
    };

    if (translation.status === 'completed') {
      response.originalText = translation.originalText;
      response.translatedText = translation.translatedText;
    } else if (translation.status === 'failed') {
      response.error = translation.error;
    }

    return res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error('Error fetching translation status', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch translation status' });
  }
};

export default {
  createTranslation,
  getTranslationStatus,
}; 