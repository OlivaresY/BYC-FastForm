export const esCR = {
  common: {
    badges: {
      optional: 'Opcional',
    },
    buttons: {
      back: 'Atrás',
      next: 'Siguiente',
      optional: 'Opcional',
    },
    placeholders: {
      select: 'Seleccionar...',
    },
  },
  creditWizard: {
    mockUserInitials: 'YO',
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
