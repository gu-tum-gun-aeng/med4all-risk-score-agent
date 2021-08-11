import { Kafka } from "kafkajs"
import sinon from "sinon"

import MessageQueue from "./messageQueue"

describe("Message Queue", () => {
  test("should call kafka.produce and kafka.consume", async () => {
    const mockKafkaJs: unknown = {
      producer: () => "test producer",
      consumer: () => ({ groupId: "test groupId" }),
    }
    const mockKafka = sinon.mock(mockKafkaJs)
    mockKafka.expects("producer").once()
    mockKafka.expects("consumer").once().calledWith({ groupId: "test groupId" })
    MessageQueue.init(mockKafkaJs as Kafka)
    mockKafka.verify()
  })
})
