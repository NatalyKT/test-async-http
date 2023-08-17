import amqp from "amqplib";
import logger from "./logger.js";

const queue = "request_queue";

async function consumeMessages() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertQueue(queue, { durable: true });

        await channel.consume(queue,
            (message) => {
                if (message) {
                    console.log(
                        "Received message: '%s'",
                        JSON.parse(message.content.toString())
                    );
                }
            },
            { noAck: true }
        );

        console.log("Microservice 2 is running & waiting for messages. To exit press CTRL+C");
    } catch (error) {
        logger.error('Error consuming messages', error);
        throw error;
    }
};

export default consumeMessages();