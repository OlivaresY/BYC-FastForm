export type LegalEntityType = 'physical' | 'legal';

export interface LegalEntitySelectorProps {
  disabled?: boolean;
  onSelectEntity: (entity: LegalEntityType) => void;
  selectedEntity: LegalEntityType;
  testID?: string;
}
