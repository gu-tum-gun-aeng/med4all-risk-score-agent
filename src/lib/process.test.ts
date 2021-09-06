import axios from "axios"
import _ from "lodash"
import sinon from "sinon"

import {
  GenderCode,
  Patient,
  PatientWithRiskScore,
  RiskScore,
  RiskScoreResponse,
} from "./model"
import Process, { mapGenderCode } from "./process"

export const buildPatientInfo = (): Patient => {
  return {
    certificateId: "123456",
    certificateType: 1,
    name: "Bruno",
    surname: "Bruno",
    ageYear: 25,
    gender: 1,
  }
}

describe("Process", () => {
  describe("processRiskScore", () => {
    test("processRiskScore should return correct PatientWithRiskScore if we put patient object with full information", async () => {
      const expectedResultFromApi: RiskScoreResponse = {
        inclusion_label: "R2",
        inclusion_label_type: "normal",
        triage_score: 136,
      }

      const patientInfo: Patient = buildPatientInfo()

      const stubAxiosPost = sinon.stub(axios, "post")
      stubAxiosPost.resolves({ data: expectedResultFromApi })

      const result: PatientWithRiskScore | Patient =
        await Process.processRiskScore(patientInfo)

      const riskScore: RiskScore = {
        inclusionLabel: expectedResultFromApi.inclusion_label,
        inclusionLabelType: expectedResultFromApi.inclusion_label_type,
        triageScore: expectedResultFromApi.triage_score,
      }
      const expected = {
        ...patientInfo,
        riskScore: riskScore,
      }
      expect(result).toEqual(expected)

      stubAxiosPost.restore()
    })

    test("processRiskScore should throw error if no patient data of age", async () => {
      const patientInfo = buildPatientInfo()
      const mockPatientWithoutAge: Omit<Patient, "ageYear"> = _.omit(
        patientInfo,
        "ageYear"
      )
      expect(Process.processRiskScore(mockPatientWithoutAge)).rejects.toEqual(
        new Error("no person age")
      )
    })
  })

  describe("mapGenderCode", () => {
    const mapGenderCases = [
      [GenderCode.male, "male"],
      [GenderCode.female, "female"],
      [GenderCode.notApplicable, undefined],
    ] as const
    test.each(mapGenderCases)(
      "if get %p should return %p",
      (gender: GenderCode, expected: string | undefined) => {
        expect(mapGenderCode(gender)).toEqual(expected)
      }
    )
  })
})
