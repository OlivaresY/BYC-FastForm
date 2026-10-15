import type { LegalEntityType } from "../types/LegalEntitySelector.types";

export const LEGAL_ENTITY_SELECTOR_COLORS = {
  ACTIVE_BORDER: "#B91C1C",
  ACTIVE_ICON_BG: "#FDE8E8",
  ACTIVE_ICON_STROKE: "#B91C1C",
  ACTIVE_SUBTITLE: "#B91C1C",
  ACTIVE_TITLE: "#111111",
  INACTIVE_BORDER: "#E5E7EB",
  INACTIVE_ICON_BG: "#EBE9E4",
  INACTIVE_ICON_STROKE: "#5A6B80",
  INACTIVE_SUBTITLE: "#5A6B80",
  INACTIVE_TITLE: "#111111",
  SUBTITLE_COLOR: "#5A6B80",
  TITLE_COLOR: "#111111",
} as const;

export const LEGAL_ENTITY_SELECTOR_COPY = {
  HEADER_SUBTITLE:
    "Selecciona el régimen legal del solicitante para habilitar los campos correctos.",
  HEADER_TITLE: "TIPO DE ENTIDAD LEGAL",
  LEGAL_SUBTITLE: "S.A. / S.R.L.",
  LEGAL_TITLE: "Persona Jurídica",
  PHYSICAL_SUBTITLE: "Asalariado / Indep.",
  PHYSICAL_TITLE: "Persona Física",
} as const;

export const LEGAL_ENTITY_SELECTOR_ENTITIES = {
  LEGAL: "legal",
  PHYSICAL: "physical",
} as const satisfies Record<string, LegalEntityType>;

export const LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS = {
  BADGE_SIZE_PX: 44,
  ICON_SIZE_PX: 22,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: "0 0 24 24",
} as const;

export interface LegalEntitySelectorIconConfig {
  paths: readonly string[];
}

export const LEGAL_ENTITY_SELECTOR_ICONS: Record<
  LegalEntityType,
  LegalEntitySelectorIconConfig
> = {
  legal: {
    paths: [
      "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
      "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
      "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
      "M10 6h4",
      "M10 10h4",
      "M10 14h4",
      "M10 18h4",
    ],
  },
  physical: {
    paths: [
      "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
      "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    ],
  },
} as const;

export const LEGAL_ENTITY_SELECTOR_STYLES = {
  ACTIVE_BADGE: "bg-[#FDE8E8]",
  ACTIVE_CARD: "border-[#B91C1C]",
  ACTIVE_SUBTITLE:
    "flex-shrink mt-0.5 text-center text-xs text-[#B91C1C] font-medium",
  ACTIVE_TITLE: "flex-shrink text-center text-sm text-[#111111] font-bold",
  CARD_BASE:
    "flex-1 min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border bg-white p-4",
  CARD_DISABLED: "opacity-40",
  CONTAINER: "w-full",
  GRID: "flex-row gap-3",
  HEADER_SUBTITLE: "mb-3 mt-1 text-sm font-normal text-[#5A6B80]",
  HEADER_TITLE: "text-xs font-bold tracking-wider text-[#111111]",
  ICON_BADGE_BASE: "mb-3 h-11 w-11 items-center justify-center rounded-full",
  INACTIVE_BADGE: "bg-[#EBE9E4]",
  INACTIVE_CARD: "border-[#E5E7EB]",
  INACTIVE_SUBTITLE: "flex-shrink mt-0.5 text-center text-xs text-[#5A6B80]",
  INACTIVE_TITLE: "flex-shrink text-center text-sm text-[#111111] font-medium",
} as const;

export const LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES = {
  FILL_NONE: "none",
  STROKE_LINE_CAP: "round",
  STROKE_LINE_JOIN: "round",
} as const;

export const LEGAL_ENTITY_SELECTOR_TEST_IDS = {
  CONTAINER: "legal-entity-selector-container",
  HEADER_SUBTITLE: "legal-entity-selector-header-subtitle",
  HEADER_TITLE: "legal-entity-selector-header-title",
  LEGAL_BADGE: "legal-entity-selector-legal-badge",
  LEGAL_CARD: "legal-entity-selector-legal-card",
  LEGAL_SUBTITLE: "legal-entity-selector-legal-subtitle",
  LEGAL_TITLE: "legal-entity-selector-legal-title",
  PHYSICAL_BADGE: "legal-entity-selector-physical-badge",
  PHYSICAL_CARD: "legal-entity-selector-physical-card",
  PHYSICAL_SUBTITLE: "legal-entity-selector-physical-subtitle",
  PHYSICAL_TITLE: "legal-entity-selector-physical-title",
} as const;
