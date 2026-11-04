import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  VEHICLE_CREDIT_SUBMIT_DELAY_MS,
} from '../constants/VehicleCredit.constants';
import { vehicleCreditSchema } from '../schemas/VehicleCredit.schema';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import {
  formatCapitalizeWords,
  formatCurrencyDisplay,
  formatYear,
  parseCurrencyToNumber,
} from '../utils/vehicleCreditFormatters';

export {
  formatCapitalizeWords,
  formatCurrencyDisplay,
  formatYear,
  parseCurrencyToNumber,
};

export const VEHICLE_CREDIT_DEFAULT_VALUES: VehicleCreditFormValues = {
  anio: '',
  color: '',
  marca: '',
  modelo: '',
  moneda: 'USD',
  monto_financiar: '',
  monto_prima: '',
  plazo_meses: '96 Meses (8 Años)',
  valor_vehiculo: '',
};

export type FinancialField = 'monto_prima' | 'valor_vehiculo';

export interface UseVehicleCreditViewModelProps {
  defaultValues?: Partial<VehicleCreditFormValues>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSuccess?: (data: VehicleCreditFormValues) => void | Promise<void>;
}

export interface UseVehicleCreditViewModelReturn {
  brands: readonly string[];
  control: Control<VehicleCreditFormValues>;
  derivedMontoFinanciar: number;
  errors: FieldErrors<VehicleCreditFormValues>;
  financingTerms: readonly string[];
  handleFinancialChange: (
    field: FinancialField,
    value: number | string,
  ) => void;
  handleNext: (e?: unknown) => Promise<void>;
  handleSubmit: (e?: unknown) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: UseFormSetValue<VehicleCreditFormValues>;
  vehicleBrands: readonly string[];
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
    trigger,
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

  useEffect(() => {
    const numValor = parseCurrencyToNumber(valorVehiculo);
    const numPrima = parseCurrencyToNumber(montoPrima);
    const result = Math.max(0, numValor - numPrima);
    const formatted = formatCurrencyDisplay(result);
    const hasFinancialInput = numValor > 0 || numPrima > 0;
    setValue('monto_financiar', formatted, { shouldValidate: false });
    if (hasFinancialInput) {
      void trigger(['monto_financiar', 'monto_prima']);
    }
  }, [montoPrima, setValue, trigger, valorVehiculo]);

  const derivedMontoFinanciar = Math.max(
    0,
    parseCurrencyToNumber(valorVehiculo) - parseCurrencyToNumber(montoPrima),
  );

  const handleFinancialChange = useCallback(
    (field: FinancialField, value: number | string): void => {
      const formatted =
        typeof value === 'number' ? formatCurrencyDisplay(value) : value;
      setValue(field, formatted, { shouldValidate: true });

      const currentValor =
        field === 'valor_vehiculo'
          ? parseCurrencyToNumber(value)
          : parseCurrencyToNumber(getValues('valor_vehiculo'));
      const currentPrima =
        field === 'monto_prima'
          ? parseCurrencyToNumber(value)
          : parseCurrencyToNumber(getValues('monto_prima'));
      const calculatedFinanciar = Math.max(0, currentValor - currentPrima);

      setValue(
        'monto_financiar',
        formatCurrencyDisplay(calculatedFinanciar),
        {
          shouldValidate: true,
        },
      );
    },
    [getValues, setValue],
  );

  const handleNext = useCallback(
    async (e?: unknown): Promise<void> => {
      const currentValor = parseCurrencyToNumber(getValues('valor_vehiculo'));
      const currentPrima = parseCurrencyToNumber(getValues('monto_prima'));
      const calculated = Math.max(0, currentValor - currentPrima);
      setValue('monto_financiar', formatCurrencyDisplay(calculated), {
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
    brands: VEHICLE_BRANDS,
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
  };
};
