import test from "ava"
import axios from "axios"
import sinon from "sinon"

import {
  GenderCode,
  Patient,
  PatientWithRiskScore,
  RiskScoreResponse,
} from "./model"
import { processRiskScore } from "./process"

test("processRiskScore should return correct PatientWithRiskScore if we put patient object with full information", async (t: any) => {
  const expectedResultFromApi: RiskScoreResponse = {
    inclusion_label: "R2",
    inclusion_label_type: "normal",
    triage_score: 136,
  }

  const stub = sinon.stub(axios, "post")

  stub.resolves({ data: { ...expectedResultFromApi } })

  const patientInfo: Patient = {
    cdPersonAge: 20,
    cdPersonPhone1: "0845784598",
    crAmpurCode: "5",
    crProvinceCode: "3",
    emPatientCommitStatusCode: 2,
    id: 1,
    cdPersonGenderCode: GenderCode.male,
    cdPersonHeightMeasure: 176,
    cdPersonWeightMeasure: 70,
    emLaboratoryTestDate: new Date("2021-06-01T00:00:00.000+07:00"),
    emPatientSymptomsCL14: true,
    emPatientDiseaseCD8: true,
    emPatientDiseaseCD12: true,
    emPatientSymptomsCL2: true,
    emPatientSymptomsCL9: true,
    emPatientSymptomsCL10: true,
    emPatientDiseaseCD11: true,
    emPatientDiseaseCD10: true,
    emPatientDiseaseCD13: true,
    emPatientDiseaseCD9: true,
    emPatientDiseaseCD4: true,
    emPatientPregnancyStatus: true,
    emPatientBedriddenStatus: true,
    emPatientSymptomsCL8: true,
    emPatientSymptomsCL13: true,
  }

  const result: PatientWithRiskScore = await processRiskScore(patientInfo)

  const expected = {
    ...patientInfo,
    riskScore: expectedResultFromApi,
  }

  t.deepEqual(result, expected)

  stub.restore()
})
