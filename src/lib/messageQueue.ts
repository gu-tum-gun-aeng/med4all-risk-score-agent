import { Consumer, Kafka, Producer } from "kafkajs"

import KafkaConfig from "../config/kafka"

type KafkaInstance = {
  readonly producer: Producer
  readonly consumer: Consumer
}

const init = (kafka: Kafka): KafkaInstance => {
  const producer: Producer = kafka.producer()
  const consumer: Consumer = kafka.consumer({ groupId: KafkaConfig.GROUP_ID })
  return {
    producer,
    consumer,
  }
}

const consume = async (
  consumer: Consumer,
  topic: string,
  cb: (message: string) => Promise<void>
) => {
  await consumer.connect()
  await consumer.subscribe({ topic: topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      })

      if (message.value === null) return

      cb(message.value.toString())
    },
  })
  await consumer.disconnect()
}

const publish = async (
  producer: Producer,
  topic: string,
  message: string
): Promise<void> => {
  await producer.connect()
  await producer.send({
    topic,
    messages: [{ value: message }],
  })
  await producer.disconnect()
}

const messageQueue = {
  init,
  consume,
  publish,
}

export default messageQueue
