import { Consumer, Kafka, KafkaMessage, Producer } from "kafkajs"
import _ from "lodash"

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

const processEachMessage = async (
  partition: number,
  message: KafkaMessage,
  producer: Producer
): Promise<void> => {
  console.log({
    partition,
    offset: message.offset,
    value: message.value?.toString(),
  })

  if (message.value === null) return

  const messageBuffer = message.value.toString()

  try {
    const patient: Patient = JSON.parse(messageBuffer)
    const riskScore = await processRiskScore(patient)
    await publish(
      producer,
      KafkaTopics.PATIENT_WITH_RISK_SCORE_TOPIC,
      JSON.stringify(riskScore)
    )
  } catch (error) {
    console.error(error)
    await publish(producer, KafkaTopics.DEAD_LETTER_QUEUE_TOPIC, messageBuffer)
  }
}

const process = async (
  consumer: Consumer,
  producer: Producer,
  topic: string
) => {
  await consumer.connect()
  await consumer.subscribe({ topic: topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ partition, message }) =>
      await processEachMessage(partition, message, producer),
  })
}

const messageQueue = {
  init,
  process,
  publish,
}

export const run = async (consumer: Consumer, producer: Producer) => {
  await messageQueue.process(consumer, producer, KafkaTopics.RAW_TOPIC)
}

export default messageQueue
