import { esCR } from '@/shared/i18n';

const STEP_2_LEGAL = esCR.creditWizard.step2LegalContact;
const STEP_2_PHYSICAL = esCR.creditWizard.step2PhysicalContact;

export const WIZARD_COPY = {
  BUTTONS: {
    BACK: 'Atrás',
    CONTINUE: 'Continuar',
    DISCARD: 'Descartar',
    NEXT: 'Siguiente',
    NEXT_CONTACT_INFO: 'Siguiente: Información de Contacto',
    SAVE_DATA: 'Guardar Datos',
    SAVE_DRAFT: 'Guardar Borrador',
  },
  CLOSE_MODAL: {
    BACKDROP_ACCESSIBILITY_LABEL: 'Cerrar diálogo tocando el fondo',
    BODY: '¿Deseas guardar los datos ingresados como borrador para continuar después, o prefieres descartar este trámite?',
    CLOSE_ACCESSIBILITY_LABEL: 'Cerrar ventana',
    DISCARD: 'Descartar',
    SAVE_DRAFT: 'Guardar Borrador',
    TITLE: 'Cerrar Trámite',
  },
  COMMON_ERRORS: {
    INVALID_FORMAT: 'Formato no válido.',
    REQUIRED_FIELD: 'Campo obligatorio.',
    SUBMIT_FAILED:
      'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
  },
  HEADER_PROGRESS: {
    COMPLETED_SUFFIX: '% LISTO',
    OF: 'DE',
    STEP_PREFIX: 'PASO',
  },
  STEP_1_APPLICANT: {
    BENEFICIARY_MODAL: {
      BACKDROP_ACCESSIBILITY_LABEL: 'Cerrar modal de beneficiario',
      BIRTH_DATE_LABEL: 'Fecha de Nacimiento *',
      BIRTH_DATE_PLACEHOLDER: 'DD-MM-AAAA',
      CLOSE_ACCESSIBILITY_LABEL: 'Cerrar',
      DOC_NUMBER_LABEL: 'Número de Identificación *',
      DOC_NUMBER_PLACEHOLDER: 'Ingrese el número de documento',
      DOC_TYPE_LABEL: 'Tipo y Número de Identificación *',
      DOC_TYPE_PLACEHOLDER: 'Seleccione tipo de documento',
      EMAIL_LABEL: 'Correo Electrónico *',
      EMAIL_PLACEHOLDER: 'ejemplo@correo.com',
      FULL_NAME_LABEL: 'Nombre Completo del Tercero *',
      FULL_NAME_PLACEHOLDER: 'Ingrese nombre completo del tercero',
      IDENTIFICATION_LABEL: 'Tipo y Número de Identificación *',
      NATIONALITY_LABEL: 'Nacionalidad *',
      NATIONALITY_PLACEHOLDER: 'Seleccione nacionalidad',
      PHONE_LABEL: 'Teléfono Principal *',
      PHONE_PLACEHOLDER: '8888-8888',
      RELATIONSHIP_LABEL: 'Parentesco o Relación *',
      RELATIONSHIP_PLACEHOLDER: 'Seleccione parentesco',
      SAVE_BUTTON: 'Guardar Datos',
      SECTION_1_TITLE: 'DOCUMENTO DE IDENTIDAD',
      SECTION_2_TITLE: 'NOMBRES Y APELLIDOS OFICIALES',
      SECTION_3_TITLE: 'DATOS DE CONTACTO',
      SECTION_4_TITLE: 'DATOS DEMOGRÁFICOS',
      SUBTITLE:
        'Complete la información de la persona a cuyo nombre se registrará el vehículo.',
      TITLE: 'Beneficiario Final (Tercero)',
    },
    DESCRIPTION:
      'Ingresa los datos básicos del solicitante para iniciar la gestión y perfilado de crédito multi-banco.',
    ERRORS: {
      LEGAL: {
        IDENTIFICATION_NUMBER: 'Ingrese un número de cédula jurídica válido.',
        IDENTIFICATION_TYPE: 'Seleccione un tipo de identificación.',
        LEGAL_NAME: 'La razón social es obligatoria.',
        REPRESENTATIVE_IDENTIFICATION:
          'La cédula del representante es obligatoria.',
        REPRESENTATIVE_NAME: 'El nombre del representante es obligatorio.',
      },
      PHYSICAL: {
        BIRTH_DATE: 'La fecha de nacimiento es obligatoria.',
        FIRST_LAST_NAME: 'El primer apellido es obligatorio.',
        FIRST_NAME: 'El primer nombre es obligatorio.',
        GENDER: 'Seleccione el género.',
        IDENTIFICATION_NUMBER: 'Ingrese un número de identificación válido.',
        IDENTIFICATION_TYPE: 'Seleccione un tipo de identificación.',
        MARITAL_STATUS: 'Seleccione el estado civil.',
        NATIONALITY: 'Seleccione la nacionalidad.',
        SECOND_LAST_NAME: 'El segundo apellido es obligatorio.',
      },
      SUBMIT_FAILED:
        'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
      THIRD_PARTY: {
        BIRTH_DATE: 'La fecha de nacimiento del beneficiario es obligatoria.',
        DOC_NUMBER:
          'El número de identificación del beneficiario es obligatorio.',
        DOC_TYPE: 'Seleccione el tipo de identificación del beneficiario.',
        EMAIL: 'El correo electrónico del beneficiario es obligatorio.',
        FULL_NAME: 'El nombre completo del beneficiario es obligatorio.',
        NATIONALITY: 'Seleccione la nacionalidad del beneficiario.',
        PHONE: 'El teléfono del beneficiario es obligatorio.',
        RELATIONSHIP: 'Seleccione el parentesco con el beneficiario.',
      },
    },
    HEADER_SUBTITLE: 'Ingrese la información básica del solicitante.',
    HEADER_TITLE: 'Datos del Solicitante',
    SUBMIT_BUTTON: 'Siguiente: Información de Contacto',
    SUBTITLE:
      'Ingresa los datos básicos del solicitante para iniciar la gestión y perfilado de crédito multi-banco.',
    TITLE: 'ENTIDAD Y PERSONAL',
  },
  STEP_2_LEGAL_CONTACT: {
    DESCRIPTION: STEP_2_LEGAL.description,
    ERRORS: {
      COMMERCIAL_ACTIVITY: {
        ACCOUNTING_PHONE_INVALID:
          STEP_2_LEGAL.errors.commercialActivity.accountingPhoneInvalid,
        ACCOUNTING_PHONE_REQUIRED:
          STEP_2_LEGAL.errors.commercialActivity.accountingPhoneRequired,
        CONSTITUTION_DATE_FUTURE:
          STEP_2_LEGAL.errors.commercialActivity.constitutionDateFuture,
        CONSTITUTION_DATE_INVALID:
          STEP_2_LEGAL.errors.commercialActivity.constitutionDateInvalid,
        CONSTITUTION_DATE_REQUIRED:
          STEP_2_LEGAL.errors.commercialActivity.constitutionDateRequired,
        ECONOMIC_SECTOR_REQUIRED:
          STEP_2_LEGAL.errors.commercialActivity.economicSectorRequired,
        EMPLOYEES_COUNT_POSITIVE:
          STEP_2_LEGAL.errors.commercialActivity.employeesCountPositive,
        EMPLOYEES_COUNT_REQUIRED:
          STEP_2_LEGAL.errors.commercialActivity.employeesCountRequired,
        MAIN_ACTIVITY_REQUIRED:
          STEP_2_LEGAL.errors.commercialActivity.mainActivityRequired,
      },
      COMMERCIAL_ADDRESS: {
        CANTON_INVALID: STEP_2_LEGAL.errors.commercialAddress.cantonInvalid,
        CANTON_REQUIRED: STEP_2_LEGAL.errors.commercialAddress.cantonRequired,
        DISTRICT_INVALID: STEP_2_LEGAL.errors.commercialAddress.districtInvalid,
        DISTRICT_REQUIRED:
          STEP_2_LEGAL.errors.commercialAddress.districtRequired,
        EXACT_ADDRESS_REQUIRED:
          STEP_2_LEGAL.errors.commercialAddress.exactAddressRequired,
        PROVINCE_REQUIRED:
          STEP_2_LEGAL.errors.commercialAddress.provinceRequired,
      },
      COMMERCIAL_REFERENCE: {
        COMPANY_REFERENCE_MIN:
          STEP_2_LEGAL.errors.commercialReference.companyReferenceMin,
        COMPANY_REFERENCE_REQUIRED:
          STEP_2_LEGAL.errors.commercialReference.companyReferenceRequired,
        IBAN_ACCOUNT_INVALID:
          STEP_2_LEGAL.errors.commercialReference.ibanAccountInvalid,
        IBAN_ACCOUNT_REQUIRED:
          STEP_2_LEGAL.errors.commercialReference.ibanAccountRequired,
        REFERENCE_PHONE_INVALID:
          STEP_2_LEGAL.errors.commercialReference.referencePhoneInvalid,
        REFERENCE_PHONE_REQUIRED:
          STEP_2_LEGAL.errors.commercialReference.referencePhoneRequired,
      },
      CONTACT_INFO: {
        CELL_PHONE_INVALID: STEP_2_LEGAL.errors.contactInfo.cellPhoneInvalid,
        CELL_PHONE_REQUIRED: STEP_2_LEGAL.errors.contactInfo.cellPhoneRequired,
        EMAIL_INVALID: STEP_2_LEGAL.errors.contactInfo.emailInvalid,
        EMAIL_REQUIRED: STEP_2_LEGAL.errors.contactInfo.emailRequired,
        OFFICE_PHONE_INVALID:
          STEP_2_LEGAL.errors.contactInfo.officePhoneInvalid,
        OFFICE_PHONE_REQUIRED:
          STEP_2_LEGAL.errors.contactInfo.officePhoneRequired,
      },
      FINANCIAL_STATEMENTS: {
        CURRENCY_INVALID:
          STEP_2_LEGAL.errors.financialStatements.currencyInvalid,
        GROSS_SALES_POSITIVE:
          STEP_2_LEGAL.errors.financialStatements.grossSalesPositive,
        GROSS_SALES_REQUIRED:
          STEP_2_LEGAL.errors.financialStatements.grossSalesRequired,
        NET_PROFIT_EXCEEDS_GROSS:
          STEP_2_LEGAL.errors.financialStatements.netProfitExceedsGross,
        NET_PROFIT_POSITIVE:
          STEP_2_LEGAL.errors.financialStatements.netProfitPositive,
        NET_PROFIT_REQUIRED:
          STEP_2_LEGAL.errors.financialStatements.netProfitRequired,
        OTHER_INCOMES_MIN:
          STEP_2_LEGAL.errors.financialStatements.otherIncomesMin,
        OTHER_INCOMES_REQUIRED:
          STEP_2_LEGAL.errors.financialStatements.otherIncomesRequired,
      },
      SUBMIT_FAILED: STEP_2_LEGAL.errors.submitFailed,
    },
    HEADER_SUBTITLE: STEP_2_LEGAL.headerSubtitle,
    HEADER_TITLE: STEP_2_LEGAL.headerTitle,
    SUBMIT_BUTTON: STEP_2_LEGAL.submitButton,
    TITLE: STEP_2_LEGAL.title,
  },
  STEP_2_PHYSICAL_CONTACT: {
    DESCRIPTION: STEP_2_PHYSICAL.description,
    ERRORS: {
      COMMERCIAL_REFERENCE: {
        COMPANY_REFERENCE_MIN:
          STEP_2_PHYSICAL.errors.commercialReference.companyReferenceMin,
        COMPANY_REFERENCE_REQUIRED:
          STEP_2_PHYSICAL.errors.commercialReference.companyReferenceRequired,
        IBAN_ACCOUNT_INVALID:
          STEP_2_PHYSICAL.errors.commercialReference.ibanAccountInvalid,
        IBAN_ACCOUNT_REQUIRED:
          STEP_2_PHYSICAL.errors.commercialReference.ibanAccountRequired,
        REFERENCE_PHONE_INVALID:
          STEP_2_PHYSICAL.errors.commercialReference.referencePhoneInvalid,
        REFERENCE_PHONE_REQUIRED:
          STEP_2_PHYSICAL.errors.commercialReference.referencePhoneRequired,
      },
      CONTACT_INFO: {
        CELL_PHONE_INVALID: STEP_2_PHYSICAL.errors.contactInfo.cellPhoneInvalid,
        CELL_PHONE_REQUIRED:
          STEP_2_PHYSICAL.errors.contactInfo.cellPhoneRequired,
        EMAIL_INVALID: STEP_2_PHYSICAL.errors.contactInfo.emailInvalid,
        EMAIL_REQUIRED: STEP_2_PHYSICAL.errors.contactInfo.emailRequired,
        HOME_PHONE_INVALID: STEP_2_PHYSICAL.errors.contactInfo.homePhoneInvalid,
      },
      EMPLOYMENT_DATA: {
        EMPLOYER_REQUIRED:
          STEP_2_PHYSICAL.errors.employmentData.employerRequired,
        EMPLOYMENT_STATUS_REQUIRED:
          STEP_2_PHYSICAL.errors.employmentData.employmentStatusRequired,
        ENTRY_DATE_FUTURE:
          STEP_2_PHYSICAL.errors.employmentData.entryDateFuture,
        ENTRY_DATE_INVALID:
          STEP_2_PHYSICAL.errors.employmentData.entryDateInvalid,
        OFFICE_PHONE_INVALID:
          STEP_2_PHYSICAL.errors.employmentData.officePhoneInvalid,
        OFFICE_PHONE_REQUIRED:
          STEP_2_PHYSICAL.errors.employmentData.officePhoneRequired,
        PROFESSION_REQUIRED:
          STEP_2_PHYSICAL.errors.employmentData.professionRequired,
      },
      FINANCIAL_CAPACITY: {
        CURRENCY_INVALID:
          STEP_2_PHYSICAL.errors.financialCapacity.currencyInvalid,
        GROSS_INCOME_POSITIVE:
          STEP_2_PHYSICAL.errors.financialCapacity.grossIncomePositive,
        GROSS_INCOME_REQUIRED:
          STEP_2_PHYSICAL.errors.financialCapacity.grossIncomeRequired,
        NET_INCOME_POSITIVE:
          STEP_2_PHYSICAL.errors.financialCapacity.netIncomePositive,
        NET_INCOME_REQUIRED:
          STEP_2_PHYSICAL.errors.financialCapacity.netIncomeRequired,
        OTHER_INCOMES_MIN:
          STEP_2_PHYSICAL.errors.financialCapacity.otherIncomesMin,
        OTHER_INCOMES_REQUIRED:
          STEP_2_PHYSICAL.errors.financialCapacity.otherIncomesRequired,
      },
      RESIDENTIAL_ADDRESS: {
        CANTON_INVALID: STEP_2_PHYSICAL.errors.residentialAddress.cantonInvalid,
        CANTON_REQUIRED:
          STEP_2_PHYSICAL.errors.residentialAddress.cantonRequired,
        DISTRICT_INVALID:
          STEP_2_PHYSICAL.errors.residentialAddress.districtInvalid,
        DISTRICT_REQUIRED:
          STEP_2_PHYSICAL.errors.residentialAddress.districtRequired,
        EXACT_ADDRESS_REQUIRED:
          STEP_2_PHYSICAL.errors.residentialAddress.exactAddressRequired,
        PROVINCE_REQUIRED:
          STEP_2_PHYSICAL.errors.residentialAddress.provinceRequired,
      },
      SUBMIT_FAILED: STEP_2_PHYSICAL.errors.submitFailed,
    },
    HEADER_SUBTITLE: STEP_2_PHYSICAL.headerSubtitle,
    HEADER_TITLE: STEP_2_PHYSICAL.headerTitle,
    SUBMIT_BUTTON: STEP_2_PHYSICAL.submitButton,
    TITLE: STEP_2_PHYSICAL.title,
  },
} as const;

export type WizardCopy = typeof WIZARD_COPY;
