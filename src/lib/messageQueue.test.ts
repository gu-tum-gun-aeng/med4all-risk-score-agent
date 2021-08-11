import { Kafka, Producer } from "kafkajs"
import sinon from "sinon"

import MessageQueue, { processEachMessage } from "./messageQueue"
import * as Process from "./process"
import { buildPatientInfo } from "./process.test"

const mockProducerObject = {
  connect: () => "connect!",
  send: ({ topic, message }: any) => `${topic} ${message}`,
  disconnect: () => "disconnect!",
}

describe("Message Queue", () => {
  test("should call kafka.produce and kafka.consume when call init", async () => {
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

describe("processEachMessage", () => {
  test("should kafka publish with correct params", async () => {
    const mockPartition = 1
    const mockMessageKafka = {
      offset: "1",
      value: Buffer.from(JSON.stringify({ test: "test" })),
    }
    const mockPatientInfo = buildPatientInfo()

    const mockProducer = sinon.mock(mockProducerObject)
    const stubProcess = sinon.stub(Process, "processRiskScore")

    stubProcess.resolves({
      ...mockPatientInfo,
      riskScore: {
        inclusion_label: "R2",
        inclusion_label_type: "normal",
        triage_score: 136,
      },
    })

    mockProducer.expects("connect").once()
    mockProducer
      .expects("send")
      .once()
      .calledWith({ topic: "patient.with-risk-score.main" })

    await processEachMessage(
      mockPartition,
      mockMessageKafka,
      mockProducerObject as unknown as Producer
    )

    mockProducer.verify()
  })
})
