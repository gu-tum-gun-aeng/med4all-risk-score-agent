import { Consumer, Kafka, Producer } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

let kafka: Kafka;
let producer: Producer;
let consumer: Consumer;

const CLIENT_ID = `med4all-waiting-list-agent-${uuidv4()}`;
const BROKER_LIST = ["localhost:9092"];
const GROUP_ID = "test-group";

const messageQueue = {
  init: () => {
    kafka = new Kafka({
      clientId: CLIENT_ID,
      brokers: BROKER_LIST,
    });
    producer = kafka.producer();
    consumer = kafka.consumer({ groupId: GROUP_ID });
  },
  consume: async (
    topic: string,
    cb: (message: string) => Promise<void>,
  ) => {
    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });

        if (message.value === null) return;

        cb(message.value.toString());
      },
    });
    // TODO: disconnect consumer here
  },
  publish: async (
    topic: string,
    message: string,
  ): Promise<void> => {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
  },
};

export default messageQueue;
