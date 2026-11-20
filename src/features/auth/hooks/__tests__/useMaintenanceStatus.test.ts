import type { SupabaseClient } from '@supabase/supabase-js';
import { esCR } from '@/shared/i18n';
import {
  MAINTENANCE_CHECK_TIMEOUT_MS,
  MAINTENANCE_SETTING_KEY,
  SYSTEM_SETTINGS_TABLE,
} from '../useMaintenanceStatus';
import { MaintenanceStatusHookPageObject } from './useMaintenanceStatus.po';

const createMockMaintenanceClient = (
  result:
    | { data: unknown; error: unknown }
    | (() => Promise<{ data: unknown; error: unknown }>),
) => {
  const maybeSingleMock =
    typeof result === 'function'
      ? jest.fn().mockImplementation(result)
      : jest.fn().mockResolvedValue(result);
  const eqMock = jest.fn().mockReturnValue({
    maybeSingle: maybeSingleMock,
  });
  const selectMock = jest.fn().mockReturnValue({
    eq: eqMock,
  });
  const fromMock = jest.fn().mockReturnValue({
    select: selectMock,
  });

  const client = {
    from: fromMock,
  } as unknown as SupabaseClient;

  return {
    client,
    eqMock,
    fromMock,
    maybeSingleMock,
    selectMock,
  };
};

describe('useMaintenanceStatus', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('activates maintenance mode immediately when EXPO_PUBLIC_MAINTENANCE_MODE is true', async () => {
    const { client, fromMock } = createMockMaintenanceClient({
      data: null,
      error: null,
    });

    const page = MaintenanceStatusHookPageObject.render({
      client,
      envFlag: 'true',
    });

    expect(page.current.isMaintenanceActive).toBe(true);
    expect(page.current.maintenanceMessage).toBe(esCR.auth.maintenance.body);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('enables maintenance mode with custom backend message when system_settings reports active maintenance', async () => {
    const backendMessage = 'Actualización programada de base de datos.';
    const { client, eqMock, fromMock, selectMock } =
      createMockMaintenanceClient({
        data: {
          is_active: true,
          message: backendMessage,
        },
        error: null,
      });

    const page = MaintenanceStatusHookPageObject.render({
      client,
      envFlag: 'false',
    });

    await page.waitForState(() => {
      expect(page.current.isMaintenanceActive).toBe(true);
    });

    expect(page.current.maintenanceMessage).toBe(backendMessage);
    expect(fromMock).toHaveBeenCalledWith(SYSTEM_SETTINGS_TABLE);
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('key', MAINTENANCE_SETTING_KEY);
  });

  it('fails open when backend returns an error or network exception', async () => {
    const { client } = createMockMaintenanceClient({
      data: null,
      error: { message: 'relation "system_settings" does not exist' },
    });

    const page = MaintenanceStatusHookPageObject.render({
      client,
      envFlag: 'false',
    });

    await page.recheck();

    expect(page.current.isMaintenanceActive).toBe(false);
    expect(page.current.maintenanceMessage).toBeUndefined();
  });

  it('fails open safely when backend maintenance check times out', async () => {
    jest.useFakeTimers();

    const { client } = createMockMaintenanceClient(
      () => new Promise(() => undefined),
    );

    const page = MaintenanceStatusHookPageObject.render({
      client,
      envFlag: 'false',
    });

    await page.advanceTimers(MAINTENANCE_CHECK_TIMEOUT_MS);

    expect(page.current.isMaintenanceActive).toBe(false);
    expect(page.current.maintenanceMessage).toBeUndefined();
  });
});
