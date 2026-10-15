import { z } from "zod";
import { APPLICANT_STEP_VIEW_NUMERICAL } from "../constants/ApplicantStepView.constants";

export const PhysicalApplicantSchema = z.object({
  birthDate: z.string().trim().min(1),
  firstLastName: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  gender: z.enum(["male", "female", "other"]),
  identificationNumber: z
    .string()
    .trim()
    .min(APPLICANT_STEP_VIEW_NUMERICAL.MIN_PHYSICAL_ID_LENGTH),
  identificationType: z.enum(["national_id", "dimex", "passport"]),
  maritalStatus: z.enum([
    "single",
    "married",
    "divorced",
    "widowed",
    "common_law",
  ]),
  middleName: z.string().trim().optional(),
  nationality: z.string().trim().min(1),
  secondLastName: z.string().trim().min(1),
});

export const LegalApplicantSchema = z.object({
  identificationNumber: z
    .string()
    .trim()
    .min(APPLICANT_STEP_VIEW_NUMERICAL.MIN_LEGAL_ID_LENGTH),
  identificationType: z.enum(["legal_id", "dimex", "nite"]),
  legalName: z.string().trim().min(1),
  representativeIdentification: z.string().trim().min(1),
  representativeName: z.string().trim().min(1),
});

export const ApplicantStepSubmissionSchema = z.discriminatedUnion("regime", [
  z.object({
    regime: z.literal("physical"),
    values: PhysicalApplicantSchema,
    vehicleBeneficiary: z.enum(["same_holder", "third_party"]),
  }),
  z.object({
    regime: z.literal("legal"),
    values: LegalApplicantSchema,
    vehicleBeneficiary: z.enum(["same_holder", "third_party"]),
  }),
]);
