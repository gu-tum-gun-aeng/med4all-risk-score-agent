export type Patient = {
  readonly certificateId: string
  readonly certificateType: CertificateType
  readonly name: string
  readonly surname: string
  readonly gender?: number
  readonly ageYear?: number
  readonly patientPhone?: string
  readonly custodianPhone?: string
  readonly weightKg?: number
  readonly heightCm?: number
  readonly medicalInfo?: MedicalInfo
  readonly checkInDate?: string
  readonly checkOutDate?: string
  readonly address?: Address
  readonly patientDataSource?: number
  readonly sourceLocation?: string
  readonly admittedTo?: string
  readonly healthCoverage?: number
  readonly lineId?: string
  readonly homeTown?: number
  readonly equipments?: readonly string[]
  readonly certificatePictureUrl?: string
  readonly covidTestPictureUrl?: string
}

export type MedicalInfo = {
  readonly patientCovidClassificationColor?: number
  readonly isAtkPositive?: boolean
  readonly isRtPcrPositive?: boolean
  readonly labTestWhen?: string
  readonly isFavipiravirReceived?: boolean
  readonly receivedFavipiravirWhen?: string
  readonly bodyTemperatureCelcius?: number
  readonly pulseRateBpm?: number
  readonly oxygenSaturation?: number
  readonly oxygenSaturationAfterExercise?: number
  readonly oxygenSaturationDifference?: number
  readonly systolic?: number
  readonly diastolic?: number
  readonly inspirationRate?: number
  readonly isPregnant?: boolean
  readonly pregnancyWeeks?: number
  readonly isBedridden?: boolean
  readonly symptoms?: string
  readonly allergyToDrugs?: readonly string[]
  readonly allergyToFoods?: readonly string[]
  readonly isSymptomShortnessOfBreath?: boolean
  readonly isSymptomFever?: boolean
  readonly isSymptomCough?: boolean
  readonly isSymptomRunnyNose?: boolean
  readonly isSymptomSoreThroat?: boolean
  readonly isSymptomFatigue?: boolean
  readonly isSymptomHeadAche?: boolean
  readonly isSymptomDiarrhea?: boolean
  readonly isSymptomLossOfSmell?: boolean
  readonly isSymptomConjunctivitis?: boolean
  readonly isSymptomRash?: boolean
  readonly isSymptomLossOfTaste?: boolean
  readonly isSymptomTiredness?: boolean
  readonly isSymptomChestPain?: boolean
  readonly isDiseaseUncontrollDm?: boolean
  readonly isDiseaseCancer?: boolean
  readonly isDiseaseCopd?: boolean
  readonly isDiseaseAsthma?: boolean
  readonly isDiseaseObesity?: boolean
  readonly isDiseaseCkdLevelHigherThanFour?: boolean
  readonly isDiseaseStrokeWithinSixMonth?: boolean
  readonly isDiseaseCardioVascularDisease?: boolean
  readonly isDiseaseHiv?: boolean
  readonly isDiseaseHypertension?: boolean
  readonly isDiseaseHyperlipidemia?: boolean
  readonly isDiseaseCirrhosis?: boolean
  readonly isDiseaseTuberculosis?: boolean
  readonly vaccinationRecords?: readonly string[]
  readonly firstVaccinedDate?: string
  readonly secondVaccinedDate?: string
  readonly remark?: string
  readonly firstDateOfSymtom?: string
}

export type Address = {
  readonly provinceCode?: number
  readonly districtCode?: number
  readonly subDistrictCode?: number
  readonly moo?: string
  readonly road?: string
  readonly alley?: string
  readonly soi?: string
  readonly village?: string
  readonly bangkokZoneCode?: number
  readonly zipCode?: number
  readonly building?: string
  readonly note?: string
}

export enum GenderCode {
  unknown = 0,
  male = 1,
  female = 2,
  notApplicable = 9,
}

export enum CertificateType {
  PersonalId = 0,
  Passport = 1,
  ForeignId = 2,
  NoDoc = 3,
}

export type PatientWithRiskScore = Patient & {
  readonly riskScore: RiskScoreResponse
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
