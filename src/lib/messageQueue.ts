import { Consumer, Kafka, Producer } from "kafkajs"

import KafkaConfig from "../config/kafka"
import KafkaTopics from "../constants/kafkaTopics"

import { Patient } from "./model"
import { processRiskScore } from "./process"

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
  producer: Producer,
  topic: string,
  cb: (message: string, producer: Producer) => Promise<void>
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

      cb(message.value.toString(), producer)
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

export const run = async (consumer: Consumer, producer: Producer) => {
  await messageQueue.consume(
    consumer,
    producer,
    KafkaTopics.RAW_TOPIC,
    (message, producer) => processMessage(message, producer)
  )
}

const processMessage = async (
  message: string,
  producer: Producer
): Promise<void> => {
  try {
    const patient: Patient = JSON.parse(message)
    const riskScore = await processRiskScore(patient)
    await messageQueue.publish(
      producer,
      KafkaTopics.PATIENT_WITH_RISK_SCORE_TOPIC,
      JSON.stringify(riskScore)
    )
  } catch (error) {
    console.error(error)
    await messageQueue.publish(
      producer,
      KafkaTopics.DEAD_LETTER_QUEUE_TOPIC,
      message
    )
  }
}

export default messageQueue
