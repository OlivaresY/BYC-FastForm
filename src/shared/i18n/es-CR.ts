export const esCR = {
  common: {
    badges: {
      optional: 'Opcional',
    },
    buttons: {
      back: 'Atrás',
      continue: 'Continuar',
      discard: 'Descartar',
      next: 'Siguiente',
      optional: 'Opcional',
      saveData: 'Guardar Datos',
      saveDraft: 'Guardar Borrador',
    },
    catalogs: {
      currencies: {
        CRC: 'Colones (₡)',
        USD: 'Dólares ($)',
      },
      economicSectors: {
        agriculture: 'Agricultura y Ganadería',
        commerce: 'Comercio',
        construction: 'Construcción',
        industry: 'Industria y Manufactura',
        other: 'Otro',
        services: 'Servicios',
        technology: 'Tecnología y Telecomunicaciones',
        tourism: 'Turismo y Hospitalidad',
        transport: 'Transporte y Logística',
      },
    },
    placeholders: {
      select: 'Seleccionar...',
    },
  },
  creditWizard: {
    mockUserInitials: 'YO',
    step2LegalContact: {
      backButton: 'Atrás',
      description:
        'Ingresa la información legal, de contacto y financiera de la empresa para la evaluación y perfilado de crédito multi-banco.',
      errors: {
        commercialActivity: {
          accountingPhoneInvalid:
            'El formato del teléfono de contabilidad no es válido.',
          accountingPhoneRequired:
            'El teléfono de contabilidad es obligatorio.',
          constitutionDateFuture:
            'La fecha de constitución no puede ser una fecha futura.',
          constitutionDateInvalid:
            'La fecha de constitución debe tener un formato DD-MM-YYYY válido.',
          constitutionDateRequired: 'La fecha de constitución es obligatoria.',
          economicSectorRequired: 'El sector económico es obligatorio.',
          employeesCountPositive:
            'La cantidad de empleados debe ser mayor a 0.',
          employeesCountRequired: 'La cantidad de empleados es obligatoria.',
          mainActivityRequired: 'La actividad principal es obligatoria.',
        },
        commercialAddress: {
          cantonInvalid: 'El cantón no pertenece a la provincia seleccionada.',
          cantonRequired: 'El cantón es obligatorio.',
          districtInvalid: 'El distrito no pertenece al cantón seleccionado.',
          districtRequired: 'El distrito es obligatorio.',
          exactAddressRequired: 'La dirección exacta es obligatoria.',
          provinceRequired: 'La provincia es obligatoria.',
        },
        commercialReference: {
          companyReferenceMin:
            'El nombre de la empresa de referencia debe tener al menos 2 caracteres.',
          companyReferenceRequired:
            'El nombre de la empresa de referencia es obligatorio.',
          ibanAccountInvalid:
            'La cuenta IBAN debe tener un formato válido de Costa Rica (ej. CR05015202001026284066).',
          ibanAccountRequired: 'La cuenta IBAN es obligatoria.',
          referencePhoneInvalid:
            'El formato del teléfono de referencia no es válido.',
          referencePhoneRequired: 'El teléfono de referencia es obligatorio.',
        },
        contactInfo: {
          cellPhoneInvalid: 'El formato del teléfono celular no es válido.',
          cellPhoneRequired: 'El teléfono celular es obligatorio.',
          emailInvalid: 'El formato del correo electrónico no es válido.',
          emailRequired: 'El correo electrónico es obligatorio.',
          officePhoneInvalid:
            'El formato del teléfono de oficina no es válido.',
          officePhoneRequired: 'El teléfono de oficina es obligatorio.',
        },
        financialStatements: {
          currencyInvalid: 'Seleccione una moneda válida (CRC o USD).',
          grossSalesPositive: 'Las ventas brutas deben ser mayores a 0.',
          grossSalesRequired: 'Las ventas brutas son obligatorias.',
          netProfitExceedsGross:
            'La utilidad neta no puede ser mayor a las ventas brutas.',
          netProfitPositive: 'La utilidad neta debe ser mayor a 0.',
          netProfitRequired: 'La utilidad neta es obligatoria.',
          otherIncomesMin: 'Otros ingresos no puede ser negativo.',
          otherIncomesRequired: 'Otros ingresos debe ser un valor numérico.',
        },
        submitFailed:
          'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
      },
      form: {
        helpers: {
          constitutionDate:
            'Fecha oficial de constitución en formato DD-MM-YYYY.',
          otherIncomes:
            'Ingresos adicionales demostrables mediante estados financieros auditados o certificación CPA.',
        },
        labels: {
          accountingPhone: 'TELÉFONO DE CONTABILIDAD',
          canton: 'CANTÓN',
          cellPhone: 'TELÉFONO CELULAR',
          companyReference: 'REFERENCIA COMERCIAL / EMPRESA',
          constitutionDate: 'FECHA DE CONSTITUCIÓN',
          currency: 'MONEDA',
          district: 'DISTRITO',
          economicSector: 'SECTOR ECONÓMICO',
          email: 'CORREO ELECTRÓNICO',
          employeesCount: 'CANTIDAD DE EMPLEADOS',
          exactAddress: 'DIRECCIÓN EXACTA',
          grossSales: 'VENTAS BRUTAS',
          ibanAccount: 'CUENTA IBAN',
          mainActivity: 'ACTIVIDAD PRINCIPAL',
          netProfit: 'UTILIDAD NETA',
          officePhone: 'TEL. OFICINA',
          otherIncomes: 'OTROS INGRESOS',
          province: 'PROVINCIA',
          referencePhone: 'TELÉFONO DE REFERENCIA',
        },
        placeholders: {
          accountingPhone: '+506 2200-0000',
          canton: 'Seleccione cantón',
          cellPhone: '+506 8888-8888',
          companyReference: 'Ej: Corporación CoriMotors S.A.',
          constitutionDate: 'DD-MM-YYYY',
          currency: 'Seleccione moneda',
          district: 'Seleccione distrito',
          economicSector: 'Seleccione sector económico',
          email: 'contacto@empresa.cr',
          employeesCount: 'Ej: 25',
          exactAddress: 'Frente a parque, edificio corporativo, piso 3...',
          grossSales: '5000000',
          ibanAccount: 'CR05015202001026284066',
          mainActivity: 'Ej: Distribución de repuestos',
          netProfit: '3500000',
          officePhone: '+506 2200-0000',
          otherIncomes: '0',
          province: 'Seleccione provincia',
          referencePhone: '+506 2200-0000',
        },
        sections: {
          section1: '1. CONTACTO CORPORATIVO',
          section2: '2. DOMICILIO COMERCIAL',
          section3: '3. ACTIVIDAD COMERCIAL',
          section4: '4. ESTADOS FINANCIEROS',
          section5: '5. REFERENCIA COMERCIAL Y CUENTA',
        },
      },
      headerSubtitle:
        'Ingresa la información legal, de contacto y financiera de la empresa para la evaluación y perfilado de crédito multi-banco.',
      headerTitle: 'Persona Jurídica',
      submitButton: 'Siguiente',
      title: 'Contacto y Comercial',
    },
    step2PhysicalContact: {
      backButton: 'Atrás',
      description:
        'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
      errors: {
        commercialReference: {
          companyReferenceMin:
            'El nombre de la empresa de referencia debe tener al menos 2 caracteres.',
          companyReferenceRequired:
            'El nombre de la empresa de referencia es obligatorio.',
          ibanAccountInvalid:
            'La cuenta IBAN debe tener un formato válido de Costa Rica (ej. CR05015202001026284066).',
          ibanAccountRequired: 'La cuenta IBAN es obligatoria.',
          referencePhoneInvalid:
            'El formato del teléfono de referencia no es válido.',
          referencePhoneRequired: 'El teléfono de referencia es obligatorio.',
        },
        contactInfo: {
          cellPhoneInvalid: 'El formato del teléfono celular no es válido.',
          cellPhoneRequired: 'El teléfono celular es obligatorio.',
          emailInvalid: 'El formato del correo electrónico no es válido.',
          emailRequired: 'El correo electrónico es obligatorio.',
          homePhoneInvalid: 'El formato del teléfono fijo no es válido.',
        },
        employmentData: {
          employerRequired: 'El nombre del patrono o empresa es obligatorio.',
          employmentStatusRequired: 'La situación laboral es obligatoria.',
          entryDateFuture: 'La fecha de ingreso no puede ser una fecha futura.',
          entryDateInvalid:
            'La fecha de ingreso debe tener un formato DD-MM-YYYY válido.',
          officePhoneInvalid:
            'El formato del teléfono de oficina no es válido.',
          officePhoneRequired: 'El teléfono de oficina es obligatorio.',
          professionRequired: 'La profesión u ocupación es obligatoria.',
        },
        financialCapacity: {
          currencyInvalid: 'Seleccione una moneda válida (CRC o USD).',
          grossIncomePositive: 'El ingreso bruto debe ser mayor a 0.',
          grossIncomeRequired: 'El ingreso bruto es obligatorio.',
          netIncomePositive: 'El ingreso neto debe ser mayor a 0.',
          netIncomeRequired: 'El ingreso neto es obligatorio.',
          otherIncomesMin: 'Otros ingresos no puede ser negativo.',
          otherIncomesRequired: 'Otros ingresos debe ser un valor numérico.',
        },
        residentialAddress: {
          cantonInvalid: 'El cantón no pertenece a la provincia seleccionada.',
          cantonRequired: 'El cantón es obligatorio.',
          districtInvalid: 'El distrito no pertenece al cantón seleccionado.',
          districtRequired: 'El distrito es obligatorio.',
          exactAddressRequired: 'La dirección exacta es obligatoria.',
          provinceRequired: 'La provincia es obligatoria.',
        },
        submitFailed:
          'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
      },
      form: {
        helpers: {
          otherIncomes:
            'Ingresos demostrables con constancia salarial adicional o certificación de CPA.',
        },
        labels: {
          canton: 'CANTÓN',
          cellPhone: 'TELÉFONO CELULAR',
          companyReference: 'REFERENCIA LABORAL / EMPRESA',
          currency: 'MONEDA DE INGRESOS',
          district: 'DISTRITO',
          email: 'CORREO ELECTRÓNICO',
          employer: 'PATRONO / EMPRESA',
          employmentStatus: 'CONDICIÓN LABORAL',
          entryDate: 'FECHA DE INGRESO',
          exactAddress: 'DIRECCIÓN EXACTA',
          grossIncome: 'INGRESO BRUTO',
          homePhone: 'TELÉFONO HABITACIÓN',
          ibanAccount: 'CUENTA IBAN',
          netIncome: 'INGRESO NETO',
          officePhone: 'TEL. OFICINA',
          otherIncomes: 'OTROS INGRESOS MENSUALES',
          profession: 'PROFESIÓN U OFICIO',
          province: 'PROVINCIA',
          referencePhone: 'TELÉFONO DE REFERENCIA',
        },
        placeholders: {
          canton: 'Seleccione cantón',
          cellPhone: '+506 8888-8888',
          companyReference: 'Ej: Corporación CoriMotors S.A.',
          currency: 'Seleccione moneda',
          district: 'Seleccione distrito',
          email: 'ejemplo@correo.com',
          employer: 'Ej: Corporación CoriMotors S.A.',
          employmentStatus: 'Seleccione situación laboral',
          entryDate: 'DD-MM-YYYY',
          exactAddress: 'Frente a parque, casa esquinera color blanco...',
          grossIncome: '1500000',
          homePhone: '+506 2222-2222',
          ibanAccount: 'CR05015202001026284066',
          netIncome: '1200000',
          officePhone: '+506 2200-0000',
          otherIncomes: '0',
          profession: 'Ej: Ingeniero de Sistemas, Administrador',
          province: 'Seleccione provincia',
          referencePhone: '+506 2200-0000',
        },
        sections: {
          section1: '1. INFORMACIÓN DE CONTACTO',
          section2: '2. DOMICILIO RESIDENCIAL',
          section3: '3. DATOS LABORALES',
          section4: '4. CAPACIDAD FINANCIERA',
          section5: '5. REFERENCIA COMERCIAL Y CUENTA',
        },
      },
      headerSubtitle:
        'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
      headerTitle: 'Contacto y Laboral',
      submitButton: 'Siguiente',
      title: 'Contacto y Laboral',
    },
    steps: {
      applicant: 'Datos del Solicitante',
      companyData: 'Datos de la Empresa',
      legal: 'Persona Jurídica',
      personalData: 'Datos Personales',
      physical: 'Contacto y Laboral',
    },
  },
} as const;

export type I18nDictionary = typeof esCR;
