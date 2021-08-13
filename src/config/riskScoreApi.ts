import { env } from "process"

const RISK_SCORE_API_URL = env.RISK_SCORE_API_URL ||
  "https://pedsanam.ydm.family/pedsanam/label_score"

const RISK_SCORE_API_KEY = env.RISK_SCORE_API_KEY || ""

export default {
  RISK_SCORE_API_URL,
  RISK_SCORE_API_KEY,
} as const
