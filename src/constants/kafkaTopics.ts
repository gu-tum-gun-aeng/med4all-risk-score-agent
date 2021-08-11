const RAW_TOPIC = "patient.raw.main"
const PATIENT_WITH_RISK_SCORE_TOPIC = "patient.with-risk-score.main"
const DEAD_LETTER_QUEUE_TOPIC = "patient.with-risk-score.dlq"

export default {
  RAW_TOPIC,
  PATIENT_WITH_RISK_SCORE_TOPIC,
  DEAD_LETTER_QUEUE_TOPIC,
} as const
