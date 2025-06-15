import amqp from "amqplib";
import { version } from "mongoose";
import { v4 } from "uuid";

const exchange = "process_task_exchange";
const routingKey = "task";

class Publisher {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async start() {
    if (this.connection) return;
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ);
      this.channel = await this.connection.createChannel();
      console.log('RabbitMQ publisher connected');
    } catch (err) {
      console.error('Failed to connect to RabbitMQ publisher', err);
      // Optional: Add retry logic here
    }
  }

  async publish(queue, message) {
    if (!this.channel) {
      throw new Error('Publisher not started. Call start() first.');
    }
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      console.log(`Message sent to queue: ${queue}`);
    } catch (err) {
      console.error(`Failed to publish message to queue ${queue}`, err);
    }
  }

  async close() {
    if (!this.connection) return;
    try {
      await this.connection.close();
      this.connection = null;
      this.channel = null;
      console.log('RabbitMQ publisher connection closed');
    } catch (err) {
      console.error('Failed to close RabbitMQ publisher connection', err);
    }
  }
}

export default Publisher;
