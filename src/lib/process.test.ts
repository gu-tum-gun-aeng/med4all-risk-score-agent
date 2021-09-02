import axios from "axios"
import _ from "lodash"
import sinon from "sinon"

import {
  GenderCode,
  Patient,
  PatientWithRiskScore,
  RiskScoreResponse,
} from "./model"
import Process, { mapGenderCode } from "./process"

export const buildPatientInfo = (): Patient => {
  return {
    certificateId: "123456",
    certificateType: 1,
    name: "Bruno",
    surname: "Fernandes",
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

      const result: PatientWithRiskScore = await Process.processRiskScore(
        patientInfo,
      )

      const expected = {
        ...patientInfo,
        riskScore: expectedResultFromApi,
      }
      expect(result).toEqual(expected)

      stubAxiosPost.restore()
    })

    test("processRiskScore should throw error if no patient data of age", async () => {
      const patientInfo = buildPatientInfo()
      const mockPatientWithoutAge: Omit<Patient, "cdPersonAge"> = _.omit(
        patientInfo,
        "cdPersonAge",
      )
      expect(Process.processRiskScore(mockPatientWithoutAge)).rejects.toEqual(
        new Error("no cd person age"),
      )
    })
  })

  describe("mapGenderCode", () => {
    const mapGenderCases = [
      [GenderCode.unknown, "unknown"],
      [GenderCode.male, "male"],
      [GenderCode.female, "female"],
      [GenderCode.notApplicable, undefined],
    ] as const
    test.each(mapGenderCases)(
      "if get %p should return %p",
      (gender: GenderCode, expected: string | undefined) => {
        expect(mapGenderCode(gender)).toEqual(expected)
      },
    )
  })
})
