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
    DESCRIPTION:
      'Ingresa la información legal, de contacto y financiera de la empresa para la evaluación y perfilado de crédito multi-banco.',
    ERRORS: {
      CONSTITUTION_DATE_FUTURE:
        'La fecha de constitución no puede ser una fecha futura.',
      CONSTITUTION_DATE_INVALID:
        'La fecha de constitución debe tener un formato DD-MM-YYYY válido.',
      CONSTITUTION_DATE_REQUIRED: 'La fecha de constitución es obligatoria.',
      CORPORATE_ID_INVALID:
        'La cédula jurídica debe tener un formato válido (ej. 3-101-123456).',
      CORPORATE_ID_REQUIRED: 'La cédula jurídica es obligatoria.',
      CORPORATE_NAME_REQUIRED: 'La razón social es obligatoria.',
      EMAIL_INVALID: 'El formato del correo electrónico no es válido.',
      EMAIL_REQUIRED: 'El correo electrónico es obligatorio.',
      GROSS_INCOME_POSITIVE: 'El ingreso bruto debe ser mayor a 0.',
      GROSS_INCOME_REQUIRED: 'El ingreso bruto es obligatorio.',
      NET_INCOME_EXCEEDS_GROSS:
        'El ingreso neto no puede ser mayor al ingreso bruto.',
      NET_INCOME_POSITIVE: 'El ingreso neto debe ser mayor a 0.',
      NET_INCOME_REQUIRED: 'El ingreso neto es obligatorio.',
      PHONE_INVALID: 'El formato del teléfono no es válido.',
      PHONE_REQUIRED: 'El teléfono es obligatorio.',
      REPRESENTATIVE_ID_REQUIRED: 'La cédula del representante es obligatoria.',
      REPRESENTATIVE_NAME_REQUIRED:
        'El nombre del representante legal es obligatorio.',
      SUBMIT_FAILED:
        'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
    },
    HEADER_SUBTITLE:
      'Ingresa la información legal, de contacto y financiera de la empresa para la evaluación y perfilado de crédito multi-banco.',
    HEADER_TITLE: 'Persona Jurídica',
    SUBMIT_BUTTON: 'Siguiente',
    TITLE: 'Persona Jurídica',
  },
  STEP_2_PHYSICAL_CONTACT: {
    DESCRIPTION:
      'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
    ERRORS: {
      CONTACT_INFO: {
        CELL_PHONE_INVALID: 'El formato del teléfono celular no es válido.',
        CELL_PHONE_REQUIRED: 'El teléfono celular es obligatorio.',
        EMAIL_INVALID: 'El formato del correo electrónico no es válido.',
        EMAIL_REQUIRED: 'El correo electrónico es obligatorio.',
        HOME_PHONE_INVALID: 'El formato del teléfono fijo no es válido.',
      },
      EMPLOYMENT_DATA: {
        EMPLOYER_REQUIRED: 'El nombre del patrono o empresa es obligatorio.',
        EMPLOYMENT_STATUS_REQUIRED: 'La situación laboral es obligatoria.',
        ENTRY_DATE_FUTURE: 'La fecha de ingreso no puede ser una fecha futura.',
        ENTRY_DATE_INVALID:
          'La fecha de ingreso debe tener un formato DD-MM-YYYY válido.',
        OFFICE_PHONE_INVALID:
          'El formato del teléfono de oficina no es válido.',
        OFFICE_PHONE_REQUIRED: 'El teléfono de oficina es obligatorio.',
        PROFESSION_REQUIRED: 'La profesión u ocupación es obligatoria.',
      },
      FINANCIAL_CAPACITY: {
        CURRENCY_INVALID: 'Seleccione una moneda válida (CRC o USD).',
        GROSS_INCOME_POSITIVE: 'El ingreso bruto debe ser mayor a 0.',
        GROSS_INCOME_REQUIRED: 'El ingreso bruto es obligatorio.',
        NET_INCOME_POSITIVE: 'El ingreso neto debe ser mayor a 0.',
        NET_INCOME_REQUIRED: 'El ingreso neto es obligatorio.',
        OTHER_INCOMES_MIN: 'Otros ingresos no puede ser negativo.',
        OTHER_INCOMES_REQUIRED: 'Otros ingresos debe ser un valor numérico.',
      },
      RESIDENTIAL_ADDRESS: {
        CANTON_REQUIRED: 'El cantón es obligatorio.',
        DISTRICT_REQUIRED: 'El distrito es obligatorio.',
        EXACT_ADDRESS_REQUIRED: 'La dirección exacta es obligatoria.',
        PROVINCE_REQUIRED: 'La provincia es obligatoria.',
      },
      SUBMIT_FAILED:
        'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
    },
    HEADER_SUBTITLE:
      'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
    HEADER_TITLE: 'Contacto y Laboral',
    SUBMIT_BUTTON: 'Siguiente',
    TITLE: 'Contacto y Laboral',
  },
} as const;

export type WizardCopy = typeof WIZARD_COPY;
