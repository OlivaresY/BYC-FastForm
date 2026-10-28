import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import type { Control, FieldErrors, Resolver } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import { vehicleCreditSchema } from '../schemas/VehicleCredit.schema';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';

const SUBMIT_DELAY_MS = 500;

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
  control: Control<VehicleCreditFormValues>;
  derivedMontoFinanciar: number;
  errors: FieldErrors<VehicleCreditFormValues>;
  handleFinancialChange: (field: FinancialField, value: number) => void;
  handleNext: (e?: unknown) => Promise<void>;
  handleSubmit: (e?: unknown) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
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
              setTimeout(resolve, SUBMIT_DELAY_MS),
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
    control,
    derivedMontoFinanciar,
    errors,
    handleFinancialChange,
    handleNext,
    handleSubmit: handleNext,
    isSubmitting,
    isValid,
  };
};
