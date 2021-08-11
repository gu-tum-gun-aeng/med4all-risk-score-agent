import { Patient } from "./lib/model";
import { processRiskScore } from "./lib/process";

import messageQueue from "./messageQueue";

const RAW_TOPIC = "patient.raw.main";
const PATIENT_WITH_RISK_SCORE_TOPIC = "patient.with-risk-score.main";
const DEAD_LETTER_QUEUE_TOPIC = "patient.with-risk-score.dlq";

messageQueue.init();

const run = async () => {
  await messageQueue.consume(RAW_TOPIC, processMessage);
};
run().catch(console.error);

export async function processMessage(message: string): Promise<void> {
  try {
    const patient: Patient = JSON.parse(message);
    await processRiskScore(patient);
    await sendToPatientWithRiskScoreQueue(message);
  } catch (error) {
    console.error(error);
    await sendToDeadLetterQueue(message);
  }
}

async function sendToDeadLetterQueue(message: string): Promise<void> {
  messageQueue.publish(DEAD_LETTER_QUEUE_TOPIC, message);
}

async function sendToPatientWithRiskScoreQueue(message: string): Promise<void> {
  messageQueue.publish(PATIENT_WITH_RISK_SCORE_TOPIC, message);
}
