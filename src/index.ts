import { Kafka } from "kafkajs"

import KafkaConfig from "./config/kafka"
import messageQueue, { run } from "./lib/messageQueue"

const kafka: Kafka = new Kafka({
  clientId: KafkaConfig.CLIENT_ID,
  brokers: KafkaConfig.BROKER_LIST,
})
const { consumer, producer } = messageQueue.init(kafka)

run(consumer, producer).catch(console.error)
