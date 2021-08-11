import { v4 as uuidv4 } from "uuid"

const CLIENT_ID = `med4all-waiting-list-agent-${uuidv4()}`
const BROKER_LIST = ["localhost:9092"]
const GROUP_ID = "test-group"

export default {
  CLIENT_ID,
  BROKER_LIST,
  GROUP_ID,
} as const
