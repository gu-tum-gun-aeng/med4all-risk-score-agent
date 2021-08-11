import { Kafka } from "kafkajs"

import { Patient } from "./lib/model"
import { processRiskScore } from "./lib/process"

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka1:9092", "kafka2:9092"],
})

const consumer = kafka.consumer({ groupId: "test-group" })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: `${topic}: ${message.value?.toString()}`,
      })

      if (!message.value) {
        return
      }

      const patient: Patient = JSON.parse(message.value.toString())
      await processRiskScore(patient)
    },
  })
}

run().catch(console.error)
