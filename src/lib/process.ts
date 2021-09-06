import * as querystring from "querystring"

import axios from "axios"
import dayjs from "dayjs"

import riskScoreApi from "../config/riskScoreApi"
import { traceWrapperAsync } from "../util/tracer"

import {
  ApiRequestBody,
  GenderCode,
  Patient,
  PatientWithRiskScore,
  RiskScore,
  RiskScoreResponse,
} from "./model"

const processRiskScore = async (
  patient: Patient
): Promise<PatientWithRiskScore> => {
  const requestHeader = {
    "API-KEY": riskScoreApi.RISK_SCORE_API_KEY,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  } as const

  const requestBody: ApiRequestBody = await buildRequestBody(patient)

  const riskScoreResponse = await axios.post<RiskScoreResponse>(
    riskScoreApi.RISK_SCORE_API_URL,
    querystring.stringify(requestBody),
    { headers: requestHeader }
  )

  const riskScore: RiskScore = {
    inclusionLabel: riskScoreResponse.data.inclusion_label,
    inclusionLabelType: riskScoreResponse.data.inclusion_label_type,
    triageScore: riskScoreResponse.data.triage_score,
  }

  await traceWrapperAsync(
    async () => {
      await axios.post<RiskScoreResponse>(
        riskScoreApi.RISK_SCORE_API_URL,
        querystring.stringify(requestBody),
        { headers: requestHeader }
      )
    },
    "external",
    "riskScoreApi"
  )

  const patientWithRiskScore: PatientWithRiskScore = {
    ...patient,
    riskScore: riskScore,
  }
  return patientWithRiskScore
}

type NHSOGender = "male" | "female" | "unknown"

const buildRequestBody = async (patient: Patient) => {
  if (!patient.ageYear) {
    return Promise.reject(new Error("no person age"))
  }

  const requestBody: ApiRequestBody = {
    age: patient.ageYear,
    gender: mapGenderCode(patient.gender),
    height: patient.heightCm,
    weight: patient.weightKg,
    infected_discover_date: dayjs(patient.medicalInfo?.labTestWhen).format(
      "YYYY-MM-DD"
    ),
    sym1_chest_tightness: patient.medicalInfo?.isSymptomChestPain ? 1 : 0,
    rf_chronic_heart_disease: patient.medicalInfo
      ?.isDiseaseCardioVascularDisease
      ? 1
      : 0,
    rf_cirrhosis: patient.medicalInfo?.isDiseaseCirrhosis ? 1 : 0,
    sym2_fever: patient.medicalInfo?.isSymptomFever ? 1 : 0,
    sym2_cannot_smell: patient.medicalInfo?.isSymptomLossOfSmell ? 1 : 0,
    sym2_red_eye: patient.medicalInfo?.isSymptomConjunctivitis ? 1 : 0,
    fac_dyslipidemia: patient.medicalInfo?.isDiseaseHyperlipidemia ? 1 : 0,
    fac_hypertension: patient.medicalInfo?.isDiseaseHypertension ? 1 : 0,
    fac_tuberculosis: patient.medicalInfo?.isDiseaseTuberculosis ? 1 : 0,
    fac_hiv: patient.medicalInfo?.isDiseaseHiv ? 1 : 0,
    fac_asthma: patient.medicalInfo?.isDiseaseAsthma ? 1 : 0,
    fac_pregnancy: patient.medicalInfo?.isPregnant ? 1 : 0,
    fac_bed_ridden_status: patient.medicalInfo?.isBedridden ? 1 : 0,
    fac_diarrhea: patient.medicalInfo?.isSymptomDiarrhea ? 1 : 0,
    fac_dyspnea: patient.medicalInfo?.isSymptomTiredness ? 1 : 0,
  }

  return requestBody
}

export const mapGenderCode = (
  genderCode: GenderCode | undefined
): undefined | NHSOGender => {
  if (genderCode === undefined) {
    return
  }
  switch (+genderCode) {
    case GenderCode.male:
      return "male"
    case GenderCode.female:
      return "female"
    case GenderCode.notApplicable:
      return
    default:
      return
  }
}

export default {
  processRiskScore,
}
