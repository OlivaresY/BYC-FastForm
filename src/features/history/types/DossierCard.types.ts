import type { HistoryDossierItem } from './history.types';

export interface DossierCardStatusStyle {
  containerClassName: string;
  textClassName: string;
}

export interface DossierCardProps {
  dossier: HistoryDossierItem;
  isPrinting?: boolean;
  onPressQuickPrint: (dossier: HistoryDossierItem) => void | Promise<void>;
  onPressRetry?: (dossier: HistoryDossierItem) => void;
  onPressViewDossier: (dossier: HistoryDossierItem) => void;
  testID?: string;
}
