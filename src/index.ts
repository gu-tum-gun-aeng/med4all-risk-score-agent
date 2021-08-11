import { Kafka } from "kafkajs"

import KafkaConfig from "./config/kafka"
import KafkaTopics from "./constants/kafkaTopics"
import messageQueue from "./lib/messageQueue"
import { Patient } from "./lib/model"
import { processRiskScore } from "./lib/process"

const kafka: Kafka = new Kafka({
  clientId: KafkaConfig.CLIENT_ID,
  brokers: KafkaConfig.BROKER_LIST,
})
const { producer, consumer } = messageQueue.init(kafka)

const run = async () =>
  await messageQueue.consume(consumer, KafkaTopics.RAW_TOPIC, processMessage)
run().catch(console.error)

const processMessage = async (message: string): Promise<void> => {
  try {
    const patient: Patient = JSON.parse(message)
    const riskScore = await processRiskScore(patient)
    await sendToPatientWithRiskScoreQueue(JSON.stringify(riskScore))
  } catch (error) {
    console.error(error)
    await sendToDeadLetterQueue(message)
  }
}

const sendToDeadLetterQueue = async (message: string): Promise<void> => {
  await messageQueue.publish(
    producer,
    KafkaTopics.DEAD_LETTER_QUEUE_TOPIC,
    message
  )
}

const sendToPatientWithRiskScoreQueue = async (
  message: string
): Promise<void> => {
  await messageQueue.publish(
    producer,
    KafkaTopics.PATIENT_WITH_RISK_SCORE_TOPIC,
    message
  )
}
