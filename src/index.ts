import { Kafka } from "kafkajs"

import KafkaConfig from "./config/kafka"
import KafkaTopics from "./constants/kafkaTopics"
import messageQueue from "./lib/messageQueue"
import { logger } from "./util/logger"

const run = async () => {
  const kafka: Kafka = new Kafka({
    clientId: KafkaConfig.CLIENT_ID,
    brokers: KafkaConfig.BROKER_LIST,
    ssl: KafkaConfig.SSL_ENABLED,
  })
  const { consumer, producer } = await messageQueue.init(kafka)
  await messageQueue.process(consumer, producer, KafkaTopics.CONSUME_RAW_TOPIC)
}

run().catch(logger.error)
