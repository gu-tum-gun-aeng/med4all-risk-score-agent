const CONSUME_RAW_TOPIC = "patient.raw.main"
const PUBLISH_PATIENT_TOPIC = "patient.processed.main"
const PUBLISH_DEAD_LETTER_QUEUE_TOPIC = "patient.processed.dlq"

export default {
  CONSUME_RAW_TOPIC,
  PUBLISH_PATIENT_TOPIC,
  PUBLISH_DEAD_LETTER_QUEUE_TOPIC,
} as const
