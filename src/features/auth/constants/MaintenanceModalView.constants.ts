export const MAINTENANCE_MODAL_COLORS = {
  BACKDROP: 'rgba(0,0,0,0.5)',
  CARD_BACKGROUND: '#FFFFFF',
  ICON_BACKGROUND: '#FEF2F2',
  ICON_COLOR: '#B91C1C',
  SHADOW_COLOR: '#000000',
  TEXT_BODY: '#5A6B80',
  TEXT_TITLE: '#111111',
} as const;

export const MAINTENANCE_MODAL_COPY = {
  BODY: 'Estamos realizando tareas de optimización en el sistema central. El acceso se encuentra temporalmente deshabilitado para garantizar la integridad de los datos. Por favor, intente ingresar nuevamente en unos minutos.',
  TITLE: 'Sistema en Mantenimiento',
} as const;

export const MAINTENANCE_MODAL_NUMERICAL = {
  ICON_SIZE: 32,
  ICON_STROKE_WIDTH: 2,
} as const;

export const MAINTENANCE_MODAL_STYLES = {
  BACKDROP: 'flex-1 items-center justify-center px-6',
  BODY: 'mt-3 text-center text-sm leading-6 text-[#5A6B80]',
  CARD: 'w-full max-w-sm items-center rounded-3xl bg-white px-6 py-8',
  ICON_CONTAINER:
    'mb-5 h-16 w-16 items-center justify-center rounded-full bg-[#FEF2F2]',
  TITLE: 'text-center text-xl font-bold text-[#111111]',
} as const;

export const MAINTENANCE_MODAL_TEST_IDS = {
  BACKDROP: 'maintenance-modal-backdrop',
  BODY: 'maintenance-modal-body',
  CARD: 'maintenance-modal-card',
  ICON_CONTAINER: 'maintenance-modal-icon-container',
  MODAL: 'maintenance-modal-root',
  TITLE: 'maintenance-modal-title',
} as const;
