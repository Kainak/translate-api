import { Schema, model } from 'mongoose';

const translationSchema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    sourceLanguage: {
      type: String,
      required: true,
    },
    targetLanguage: {
      type: String,
      required: true,
    },
    translatedText: {
      type: String,
    },
    error: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default model('Translation', translationSchema); 