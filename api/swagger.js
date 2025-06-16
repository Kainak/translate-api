import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = {
  info: {
    title: 'Translation API',
    description: 'API for translating text.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  basePath: '/translations',
  components: {
    schemas: {
      CreateTranslationRequest: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            example: 'Hello, world!',
          },
          targetLanguage: {
            type: 'string',
            example: 'pt',
          },
        },
        required: ['text', 'targetLanguage'],
      },
      CreateTranslationResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Request received and is being processed.',
          },
          requestId: {
            type: 'string',
            example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
          },
        },
      },
      GetTranslationStatusResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'completed',
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

const outputFile = path.join(__dirname, '..', 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, 'routes', 'translationRouter.js')];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});
