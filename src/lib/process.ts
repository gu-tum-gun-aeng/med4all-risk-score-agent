import * as querystring from "querystring"

import axios from "axios"
import dayjs from "dayjs"

import riskScoreApi from "../config/riskScoreApi"

import {
  ApiRequestBody,
  GenderCode,
  Patient,
  PatientWithRiskScore,
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
  const patientWithRiskScore: PatientWithRiskScore = {
    ...patient,
    riskScore: riskScoreResponse.data,
  }
  return patientWithRiskScore
}

type NHSOGender = "male" | "female" | "unknown"

const buildRequestBody = async (patient: Patient) => {
  if (!patient.cdPersonAge) {
    return Promise.reject(new Error("no cd person age"))
  }

  const requestBody: ApiRequestBody = {
    age: patient.cdPersonAge,
    gender: mapGenderCode(patient.cdPersonGenderCode),
    height: (patient.cdPersonHeightMeasure ?? 0) / 100,
    weight: patient.cdPersonWeightMeasure,
    infected_discover_date: dayjs(patient.emLaboratoryTestDate).format(
      "YYYY-MM-DD"
    ),
    sym1_chest_tightness: +patient.emPatientSymptomsCL14!,
    rf_chronic_heart_disease: +patient.emPatientDiseaseCD8!,
    rf_cirrhosis: +patient.emPatientDiseaseCD12!,
    sym2_fever: +patient.emPatientSymptomsCL2!,
    sym2_cannot_smell: +patient.emPatientSymptomsCL9!,
    sym2_red_eye: +patient.emPatientSymptomsCL10!,
    fac_dyslipidemia: +patient.emPatientDiseaseCD11!,
    fac_hypertension: +patient.emPatientDiseaseCD10!,
    fac_tuberculosis: +patient.emPatientDiseaseCD13!,
    fac_hiv: +patient.emPatientDiseaseCD9!,
    fac_asthma: +patient.emPatientDiseaseCD4!,
    fac_pregnancy: +patient.emPatientPregnancyStatus!,
    fac_bed_ridden_status: +patient.emPatientBedriddenStatus!,
    fac_diarrhea: +patient.emPatientSymptomsCL8!,
    fac_dyspnea: +patient.emPatientSymptomsCL13!,
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
    case GenderCode.unknown:
      return "unknown"
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
