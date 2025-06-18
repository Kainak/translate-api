import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, '..', 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, 'app.js')];

const doc = {
  info: {
    title: 'Translation API',
    description: 'API for translating text.',
  },
  servers: [
    {
      url: 'http://127.0.0.1:4040',
      description: 'Development server',
    },
  ],
  components: {
    '@schemas': {
      CreateTranslationRequest: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            example: 'Hello, world!',
          },
          to: {
            type: 'string',
            example: 'pt',
          },
        },
        required: ['text', 'targetLanguage'],
      },
      CreateTranslationResponse: {
        type: 'object',
        properties: {
          requestId: {
            type: 'string',
            example: '4ed4809e-0c7d-4500-817d-a833c0fd1d13',
          },
          status: {
            type: 'string',
            example: 'queued',
          },
        },
      },
      GetTranslationStatusResponse: {
        type: 'object',
        properties: {
          requestId: {
            type: 'string',
            example: '4ed4809e-0c7d-4500-817d-a833c0fd1d13',
          },
          status: {
            type: 'string',
            example: 'completed',
          },
          createdAt: {
            type: 'string',
            example: '2025-06-17T23:31:59.806Z',
          },
          originalText: {
            type: 'string',
            example: 'Hello, world!',
          },
          translatedText: {
            type: 'string',
            example: 'Olá, Mundo!',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'An error occurred.',
          },
        },
      },
    },
  },
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});
