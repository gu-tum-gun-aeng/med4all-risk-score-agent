import { env } from "process"

const RISK_SCORE_ENDPOINT =
  env.RISK_SCORE_ENDPOINT || "https://pedsanam.ydm.family/pedsanam/label_score"

export default {
  RISK_SCORE_ENDPOINT,
} as const
