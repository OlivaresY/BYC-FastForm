import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  Control,
  FieldErrors,
  Resolver,
  UseFormSetValue,
} from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
  VEHICLE_COLORS_YEARS,
  VEHICLE_CREDIT_SUBMIT_DELAY_MS,
  VEHICLE_MODELS,
} from '../constants/VehicleCredit.constants';
import { vehicleCreditSchema } from '../schemas/VehicleCredit.schema';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';

export const VEHICLE_CREDIT_DEFAULT_VALUES: VehicleCreditFormValues = {
  color_ano: '',
  marca: '',
  modelo: '',
  moneda: 'USD',
  monto_financiar: 0,
  monto_prima: 0,
  plazo_meses: 84,
  valor_vehiculo: 0,
};

export type FinancialField = 'monto_prima' | 'valor_vehiculo';

export interface UseVehicleCreditViewModelProps {
  defaultValues?: Partial<VehicleCreditFormValues>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSuccess?: (data: VehicleCreditFormValues) => void | Promise<void>;
}

export interface UseVehicleCreditViewModelReturn {
  availableColorsYears: readonly string[];
  availableModels: readonly string[];
  brands: readonly string[];
  colorsYears: readonly string[];
  control: Control<VehicleCreditFormValues>;
  derivedMontoFinanciar: number;
  errors: FieldErrors<VehicleCreditFormValues>;
  financingTerms: readonly string[];
  handleFinancialChange: (field: FinancialField, value: number) => void;
  handleNext: (e?: unknown) => Promise<void>;
  handleSubmit: (e?: unknown) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: UseFormSetValue<VehicleCreditFormValues>;
  vehicleBrands: readonly string[];
  vehicleColorsYears: readonly string[];
}

export const useVehicleCreditViewModel = (
  props?: UseVehicleCreditViewModelProps,
): UseVehicleCreditViewModelReturn => {
  const {
    defaultValues: defaultValuesProp,
    mode = 'onChange',
    onSuccess,
  } = props ?? {};

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit: formHandleSubmit,
    setValue,
  } = useForm<VehicleCreditFormValues>({
    defaultValues: {
      ...VEHICLE_CREDIT_DEFAULT_VALUES,
      ...defaultValuesProp,
    },
    mode,
    resolver: zodResolver(
      vehicleCreditSchema as never,
    ) as unknown as Resolver<VehicleCreditFormValues>,
  });

  const selectedMarca = useWatch({
    control,
    defaultValue:
      defaultValuesProp?.marca ?? VEHICLE_CREDIT_DEFAULT_VALUES.marca,
    name: 'marca',
  });

  const valorVehiculo = useWatch({
    control,
    defaultValue: VEHICLE_CREDIT_DEFAULT_VALUES.valor_vehiculo,
    name: 'valor_vehiculo',
  });
  const montoPrima = useWatch({
    control,
    defaultValue: VEHICLE_CREDIT_DEFAULT_VALUES.monto_prima,
    name: 'monto_prima',
  });

  const prevMarcaRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      prevMarcaRef.current !== undefined &&
      prevMarcaRef.current !== selectedMarca
    ) {
      setValue('modelo', '', { shouldValidate: true });
    }
    prevMarcaRef.current = selectedMarca;
  }, [selectedMarca, setValue]);

  const availableModels = useMemo<readonly string[]>(() => {
    if (!selectedMarca || !(selectedMarca in VEHICLE_MODELS)) {
      return [];
    }
    return VEHICLE_MODELS[selectedMarca as keyof typeof VEHICLE_MODELS];
  }, [selectedMarca]);

  const derivedMontoFinanciar =
    (typeof valorVehiculo === 'number'
      ? valorVehiculo
      : Number(valorVehiculo) || 0) -
    (typeof montoPrima === 'number' ? montoPrima : Number(montoPrima) || 0);

  const handleFinancialChange = useCallback(
    (field: FinancialField, value: number): void => {
      setValue(field, value, { shouldValidate: true });

      const currentValor =
        field === 'valor_vehiculo' ? value : getValues('valor_vehiculo') || 0;
      const currentPrima =
        field === 'monto_prima' ? value : getValues('monto_prima') || 0;
      const calculatedFinanciar = currentValor - currentPrima;

      setValue('monto_financiar', calculatedFinanciar, {
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const handleNext = useCallback(
    async (e?: unknown): Promise<void> => {
      const currentValor = getValues('valor_vehiculo') || 0;
      const currentPrima = getValues('monto_prima') || 0;
      setValue('monto_financiar', currentValor - currentPrima, {
        shouldValidate: true,
      });

      setIsSubmitting(true);
      try {
        await formHandleSubmit(
          async (validData: VehicleCreditFormValues): Promise<void> => {
            await new Promise((resolve) =>
              setTimeout(resolve, VEHICLE_CREDIT_SUBMIT_DELAY_MS),
            );
            await onSuccess?.(validData);
          },
        )(e as never);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formHandleSubmit, getValues, onSuccess, setValue],
  );

  return {
    availableColorsYears: VEHICLE_COLORS_YEARS,
    availableModels,
    brands: VEHICLE_BRANDS,
    colorsYears: VEHICLE_COLORS_YEARS,
    control,
    derivedMontoFinanciar,
    errors,
    financingTerms: FINANCING_TERMS,
    handleFinancialChange,
    handleNext,
    handleSubmit: handleNext,
    isSubmitting,
    isValid,
    setValue,
    vehicleBrands: VEHICLE_BRANDS,
    vehicleColorsYears: VEHICLE_COLORS_YEARS,
  };
};
