export type Patient = {
  readonly cdPersonID?: string
  readonly cdPersonForeignID?: string
  readonly cdPersonPassportID?: string
  readonly cdPersonNationalityCode?: number
  readonly cdPersonNameTitleCode?: number
  readonly cdPersonFirstName?: string
  readonly cdPersonMiddleName?: string
  readonly cdPersonLastName?: string
  readonly cdPersonGenderCode?: GenderCode
  readonly cdPersonAge?: number
  readonly cdPersonBirthDate?: string
  readonly cdPersonPhone1: string
  readonly cdPersonPhone2?: string
  readonly cdPersonCustodialPhone1?: string
  readonly cdPersonCustodialPhone2?: string
  readonly cdPersonWeightMeasure?: number
  readonly cdPersonHeightMeasure?: number
  readonly cdPersonBMIMeasure?: string
  readonly emLaboratoryTestATK?: boolean
  readonly emLaboratoryTestRTPCR?: boolean
  readonly emLaboratoryTestDate?: Date
  readonly emPatientGotFavipiravir?: boolean
  readonly emPatientGotFavipiravirDate?: Date
  readonly emPatientCommitStatusCode: number
  readonly emPatientCommitTemperature?: number
  readonly emPatientCommitPulse?: number
  readonly emPatientCommitOxygenSaturation?: number
  readonly emPatientCommitOxygenSaturationPost?: number
  readonly emPatientCommitOxygenSaturationDiff?: number
  readonly emPatientCommitSystolic?: number
  readonly emPatientCommitDiastolic?: number
  readonly emPatientCommitInspirationRate?: number
  readonly emPatientPregnancyStatus?: boolean
  readonly emPatientPregnancyWeeks?: number
  readonly emPatientBedriddenStatus?: boolean
  readonly emPatientSymptomsText?: string
  readonly emPatientAllergyDrug?: string
  readonly emPatientAllergyFood?: string
  readonly emPatientFoodText?: string
  readonly emPatientSymptomsCL1?: boolean
  readonly emPatientSymptomsCL2?: boolean
  readonly emPatientSymptomsCL3?: boolean
  readonly emPatientSymptomsCL4?: boolean
  readonly emPatientSymptomsCL5?: boolean
  readonly emPatientSymptomsCL6?: boolean
  readonly emPatientSymptomsCL7?: boolean
  readonly emPatientSymptomsCL8?: boolean
  readonly emPatientSymptomsCL9?: boolean
  readonly emPatientSymptomsCL10?: boolean
  readonly emPatientSymptomsCL11?: boolean
  readonly emPatientSymptomsCL12?: boolean
  readonly emPatientSymptomsCL13?: boolean
  readonly emPatientSymptomsCL14?: boolean
  readonly emPatientDiseaseCD1?: boolean
  readonly emPatientDiseaseCD2?: boolean
  readonly emPatientDiseaseCD3?: boolean
  readonly emPatientDiseaseCD4?: boolean
  readonly emPatientDiseaseCD5?: boolean
  readonly emPatientDiseaseCD6?: boolean
  readonly emPatientDiseaseCD7?: boolean
  readonly emPatientDiseaseCD8?: boolean
  readonly emPatientDiseaseCD9?: boolean
  readonly emPatientDiseaseCD10?: boolean
  readonly emPatientDiseaseCD11?: boolean
  readonly emPatientDiseaseCD12?: boolean
  readonly emPatientDiseaseCD13?: boolean
  readonly emHICICode?: number
  readonly emHICITypeCode?: number
  readonly cdMedicalDoctorCode?: string
  readonly emPatientCheckInDate?: Date
  readonly emPatientCheckOutDate?: Date
  readonly crProvinceCode: string
  readonly crAmpurCode: string
  readonly crTumbolCode?: string
  readonly crMooCode?: string
  readonly crRoad?: string
  readonly crTrok?: string
  readonly crSoi?: string
  readonly crVillage?: string
  readonly crZoneCode?: number
  readonly crBuildingName?: string
  readonly crAddressText?: string
  readonly crGeographicCoordinateLatitude?: string
  readonly crGeographicCoordinateLongitude?: string
  readonly emPatientCommitDate?: Date
  readonly emPatientMovementDate?: Date
  readonly emPatientWaitingHours?: number
  readonly emSourceNumberCode?: number
  readonly emMoveToLocationCode?: string
  readonly emMoveToLocationTypeCode?: number
  readonly emMoveFromLocationCode?: string
  readonly emMoveFromLocationTypeCode?: number
  readonly emMoveToMethodCode?: number
  readonly cdOrganizationMedicalUnit?: number
  readonly hsPatientHospitalNumber?: string
  readonly hsPatientAdmissionNumber?: string
  readonly hsPatientHealthCoverage?: number
  readonly createdAt?: Date
  readonly updatedAt?: Date
  readonly deletedAt?: Date
}

export type PatientWithRiskScore = Patient & {
  readonly riskScore: RiskScoreResponse
}

export enum GenderCode {
  unknown = 0,
  male = 1,
  female = 2,
  notApplicable = 9,
}

export type RiskScoreResponse = {
  readonly inclusion_label: string
  readonly inclusion_label_type: string
  readonly triage_score: number
}

export type ApiRequestBody = {
  readonly age: number
  readonly gender?: string
  readonly height?: number
  readonly weight?: number
  readonly infected_discover_date?: string
  readonly sp_o2?: number
  readonly sp_o2_ra?: number
  readonly sp_o2_after_eih?: number
  readonly eih_result?: string
  readonly sym1_severe_cough?: number
  readonly sym1_chest_tightness?: number
  readonly sym1_poor_appetite?: number
  readonly sym1_fatigue?: number
  readonly sym1_persistent_fever?: number
  readonly rf_copd_chronic_lung_disease?: number
  readonly rf_ckd_stage_3_to_4?: number
  readonly rf_chronic_heart_disease?: number
  readonly rf_cva?: number
  readonly rf_t2dm?: number
  readonly rf_cirrhosis?: number
  readonly rf_immunocompromise?: number
  readonly sym2_tired_body_ache?: number
  readonly sym2_cough?: number
  readonly sym2_fever?: number
  readonly sym2_liquid_stool?: number
  readonly sym2_cannot_smell?: number
  readonly sym2_rash?: number
  readonly sym2_red_eye?: number
  readonly fac_diabetes?: number
  readonly fac_dyslipidemia?: number
  readonly fac_hypertension?: number
  readonly fac_esrd?: number
  readonly fac_cancer?: number
  readonly fac_tuberculosis?: number
  readonly fac_hiv?: number
  readonly fac_asthma?: number
  readonly fac_pregnancy?: number
  readonly fac_bed_ridden_status?: number
  readonly fac_uri_symptoms?: number
  readonly fac_diarrhea?: number
  readonly fac_dyspnea?: number
  readonly fac_gi_symptoms?: number
}
