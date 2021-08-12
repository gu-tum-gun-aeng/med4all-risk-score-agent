const CONSUME_RAW_TOPIC = "patient.raw.main"
const PUBLISH_PATIENT_WITH_RISK_SCORE_TOPIC = "patient.with-risk-score.main"
const PUBLISH_DEAD_LETTER_QUEUE_TOPIC = "patient.with-risk-score.dlq"

export default {
  CONSUME_RAW_TOPIC,
  PUBLISH_PATIENT_WITH_RISK_SCORE_TOPIC,
  PUBLISH_DEAD_LETTER_QUEUE_TOPIC,
} as const
