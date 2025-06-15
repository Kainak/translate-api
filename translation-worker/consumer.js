import amqp from 'amqplib';
import Translation from '../api/models/translationModel.js';

const TRANSLATION_QUEUE = 'translation_queue';

class TranslationConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async start() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(TRANSLATION_QUEUE, { durable: true });
      this.channel.prefetch(1); // Process one message at a time
      console.log('RabbitMQ consumer connected and waiting for messages.');

      this.channel.consume(TRANSLATION_QUEUE, (msg) => this.processMessage(msg), { noAck: false });
    } catch (err) {
      console.error('Failed to connect to RabbitMQ consumer', err);
    }
  }

  async processMessage(msg) {
    if (!msg) return;

    let data;
    try {
      data = JSON.parse(msg.content.toString());
      const { requestId, text } = data;
      console.log(`Received translation request: ${requestId}`);

      // Update status to 'processing'
      await Translation.updateOne({ requestId }, { $set: { status: 'processing' } });

      // Simulate translation work (e.g., reverse the string)
      const translatedText = text.split('').reverse().join('');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

      // Update status to 'completed'
      await Translation.updateOne(
        { requestId },
        { $set: { status: 'completed', translatedText } }
      );
      console.log(`Translation completed for request: ${requestId}`);

      this.channel.ack(msg);
    } catch (err) {
      console.error('Error processing message', err);
      if (data && data.requestId) {
        // Update status to 'failed'
        await Translation.updateOne(
          { requestId: data.requestId },
          { $set: { status: 'failed', error: err.message } }
        );
      }
      // We still ack the message to avoid requeueing a poison message
      this.channel.ack(msg);
    }
  }
}

export default TranslationConsumer; 