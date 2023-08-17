import amqp from "amqplib";
import logger from "./logger.js";

const queue = "request_queue";
const message = {
  item_id: "Hallo there!",
  text: "Just a test message. Don't worry about it, just be happy if you read it when you started the program",
};

async function sendMessageToQueue(message) {
  let connection;
  try {
    connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    const options = { persistent: true };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), options);

    console.log("Sent message: '%s'", message);
    await channel.close();
  } catch (error) {
    logger.warn(error);
  }
  if (connection) {
    await connection.close();
  }
};

export default sendMessageToQueue(message);