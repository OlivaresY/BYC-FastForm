import { Redirect } from 'expo-router';
import React from 'react';

const NUEVO_TRAMITE_FALLBACK_ROUTE = '/(tabs)/historial' as const;

const NuevoTramiteFallbackScreen = (): React.JSX.Element => (
  <Redirect href={NUEVO_TRAMITE_FALLBACK_ROUTE} />
);

export default NuevoTramiteFallbackScreen;
