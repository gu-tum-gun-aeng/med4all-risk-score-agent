import { Kafka, Producer } from "kafkajs"
import sinon from "sinon"

import MessageQueue, { processEachMessage } from "./messageQueue"
import Process from "./process"
import { buildPatientInfo } from "./process.test"

const mockProducerObject = {
  connect: () => "connect!",
  send: ({ topic, message }: any) => `${topic} ${message}`,
  disconnect: () => "disconnect!",
}

const mockConsumerObject = {
  connect: () => "connect!",
  groupId: "test-group"
}

describe("init", () => {
  test("should call kafka.produce and kafka.consume when call init", async () => {
    const mockKafkaJs: unknown = {
      producer: () => "test producer",
      consumer: () => ({ groupId: "test groupId" }),
    }
    const mockKafka = sinon.mock(mockKafkaJs)
    mockKafka.expects("producer").once().returns(mockProducerObject)
    mockKafka.expects("consumer").once().withArgs({ groupId: "test-group" }).returns(mockConsumerObject)
    MessageQueue.init(mockKafkaJs as Kafka)

    mockKafka.verify()
  })
})

describe("processEachMessage", () => {
  test("should kafka publish with correct params that get from process patient", async () => {
    const mockMessageKafka = {
      offset: "1",
      value: Buffer.from(JSON.stringify({ test: "test" })),
    }
    const mockPatientInfo = buildPatientInfo()
    const mockRiskScore = {
      inclusion_label: "R2",
      inclusion_label_type: "normal",
      triage_score: 136,
    }

    const mockProducer = sinon.mock(mockProducerObject)
    const stubProcess = sinon.stub(Process, "processRiskScore")

    stubProcess.resolves({
      ...mockPatientInfo,
      riskScore: mockRiskScore,
    })

    mockProducer.expects("connect").never()
    mockProducer
      .expects("send")
      .once()
      .withArgs({
        topic: "patient.with-risk-score.main",
        messages: [
          {
            value: JSON.stringify({
              ...mockPatientInfo,
              riskScore: mockRiskScore,
            }),
          },
        ],
      })

    await processEachMessage(
      mockMessageKafka,
      mockProducerObject as unknown as Producer
    )

    mockProducer.verify()

    stubProcess.restore()
  })
})
