import { randomUUID } from 'crypto';
import httpStatus from 'http-status';
import Translation from '../models/translationModel.js';
import Publisher from '../services/publish.js';

const TRANSLATION_QUEUE = 'translation_queue';

const createTranslation = async (req, res) => {
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