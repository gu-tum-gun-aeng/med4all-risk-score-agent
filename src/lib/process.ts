import * as querystring from "querystring"

import axios from "axios"
import dayjs from "dayjs"

import {
  ApiRequestBody,
  GenderCode,
  Patient,
  PatientWithRiskScore,
  RiskScoreResponse,
} from "./model"

export const processRiskScore = async (
  message: Patient
): Promise<PatientWithRiskScore> => {
  const scoreUrlEndpoint = ""

  if (!message.cdPersonAge) {
    return Promise.reject(new Error("no cd person age"))
  }

  const requestBody: ApiRequestBody = {
    age: message.cdPersonAge,
    gender: mapGenderCode(message.cdPersonGenderCode),
    height: message.cdPersonHeightMeasure! / 100,
    weight: message.cdPersonWeightMeasure,
    infected_discover_date: dayjs(message.emLaboratoryTestDate).format(
      "YYYY-MM-DD"
    ),
    sym1_chest_tightness: +message.emPatientSymptomsCL14!,
    rf_chronic_heart_disease: +message.emPatientDiseaseCD8!,
    rf_cirrhosis: +message.emPatientDiseaseCD12!,
    sym2_fever: +message.emPatientSymptomsCL2!,
    sym2_cannot_smell: +message.emPatientSymptomsCL9!,
    sym2_red_eye: +message.emPatientSymptomsCL10!,
    fac_dyslipidemia: +message.emPatientDiseaseCD11!,
    fac_hypertension: +message.emPatientDiseaseCD10!,
    fac_tuberculosis: +message.emPatientDiseaseCD13!,
    fac_hiv: +message.emPatientDiseaseCD9!,
    fac_asthma: +message.emPatientDiseaseCD4!,
    fac_pregnancy: +message.emPatientPregnancyStatus!,
    fac_bed_ridden_status: +message.emPatientBedriddenStatus!,
    fac_diarrhea: +message.emPatientSymptomsCL8!,
    fac_dyspnea: +message.emPatientSymptomsCL13!,
  }

  const requestHeader = {
    "API-KEY": "",
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  }
  const riskScoreResponse = await axios.post<RiskScoreResponse>(
    scoreUrlEndpoint,
    querystring.stringify(requestBody),
    { headers: requestHeader }
  )
  const patientWithRiskScore: PatientWithRiskScore = {
    ...message,
    riskScore: riskScoreResponse.data,
  }
  return patientWithRiskScore
}

// it seems we cannot have more than 2 genders ?
// meh
type Gender = "male" | "female" | "unknown"

const mapGenderCode = (
  genderCode: GenderCode | undefined
): undefined | Gender => {
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
