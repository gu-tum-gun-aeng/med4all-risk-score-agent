import { Consumer, Kafka, KafkaMessage, Producer } from "kafkajs"

import KafkaConfig from "../config/kafka"
import KafkaTopics from "../constants/kafkaTopics"
import { traceWrapperAsync } from "../util/tracer"

import { Patient } from "./model"
import Process from "./process"

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
  await traceWrapperAsync(
    async () => {
      await producer.send({
        topic,
        messages: [{ value: message }],
      })
    },
    "external",
    "kafkaPublish"
  )
  await producer.disconnect()
}

export const processEachMessage = async (
  partition: number,
  message: Partial<KafkaMessage>,
  producer: Producer
): Promise<void> => {
  if (message.value === null || message.value === undefined) return
  const messageBuffer = message.value.toString()

  console.log({
    partition,
    offset: message.offset,
    value: message.value?.toString(),
  })

  try {
    const patient: Patient = JSON.parse(messageBuffer)
    const patientWithRiskScore = await Process.processRiskScore(patient)
    await messageQueue.publish(
      producer,
      KafkaTopics.PUBLISH_PATIENT_WITH_RISK_SCORE_TOPIC,
      JSON.stringify(patientWithRiskScore)
    )
  } catch (error) {
    console.error(error)
    await publish(
      producer,
      KafkaTopics.PUBLISH_DEAD_LETTER_QUEUE_TOPIC,
      messageBuffer
    )
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
  await messageQueue.process(consumer, producer, KafkaTopics.CONSUME_RAW_TOPIC)
}

export default messageQueue
