import type { CustomSelectOption } from '@/shared/ui';

type CantonDistricts = Readonly<Record<string, readonly string[]>>;

export const LOCATION_OTHER_OPTION = 'Otro';

/**
 * Hierarchy: province -> canton -> districts. Values are the same display
 * strings already persisted by the forms ('San José', 'Central', 'Carmen').
 * Every canton additionally accepts LOCATION_OTHER_OPTION as a district
 * (see getDistrictOptions) so users are never blocked by a missing district.
 */
export const COSTA_RICA_LOCATIONS = {
  Alajuela: {
    Alajuela: [
      'Alajuela',
      'San José',
      'Carrizal',
      'San Antonio',
      'Guácima',
      'San Isidro',
      'Sabanilla',
      'San Rafael',
      'Río Segundo',
      'Desamparados',
      'Turrúcares',
      'Tambor',
      'Garita',
      'Sarapiquí',
    ],
    Atenas: [],
    Grecia: [],
    Guatuso: [],
    'Los Chiles': [],
    Naranjo: [],
    Orotina: [],
    Palmares: [],
    Poás: [],
    'Río Cuarto': [],
    'San Carlos': [],
    'San Mateo': [],
    'San Ramón': [],
    Sarchí: [],
    Upala: [],
    Zarcero: [],
  },
  Cartago: {
    Alvarado: [],
    Cartago: [
      'Oriental',
      'Occidental',
      'Carmen',
      'San Nicolás',
      'Aguacaliente',
      'Guadalupe',
      'Corralillo',
      'Tierra Blanca',
      'Dulce Nombre',
      'Llano Grande',
      'Quebradilla',
    ],
    'El Guarco': [],
    Jiménez: [],
    'La Unión': [],
    Oreamuno: [],
    Paraíso: [],
    Turrialba: [],
  },
  Guanacaste: {
    Abangares: [],
    Bagaces: [],
    Carrillo: [],
    Cañas: [],
    Hojancha: [],
    'La Cruz': [],
    Liberia: [],
    Nandayure: [],
    Nicoya: [],
    'Santa Cruz': [],
    Tilarán: [],
  },
  Heredia: {
    Barva: [],
    Belén: [],
    Flores: [],
    Heredia: ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'],
    'San Isidro': [],
    'San Pablo': [],
    'San Rafael': [],
    'Santa Bárbara': [],
    'Santo Domingo': [],
    Sarapiquí: [],
  },
  Limón: {
    Guácimo: [],
    Limón: ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama'],
    Matina: [],
    Pococí: [],
    Siquirres: [],
    Talamanca: [],
  },
  Puntarenas: {
    'Buenos Aires': [],
    Corredores: [],
    'Coto Brus': [],
    Esparza: [],
    Garabito: [],
    Golfito: [],
    Monteverde: [],
    'Montes de Oro': [],
    Osa: [],
    Parrita: [],
    Puntarenas: [
      'Puntarenas',
      'Pitahaya',
      'Chomes',
      'Lepanto',
      'Paquera',
      'Manzanillo',
      'Guacimal',
      'Barranca',
      'Monte Verde',
      'Cóbano',
      'Chacarita',
      'Chira',
      'Acapulco',
      'El Roble',
      'Arancibia',
    ],
    'Puerto Jiménez': [],
    Quepos: [],
  },
  'San José': {
    Acosta: ['San Ignacio', 'Guaitil', 'Palmichal', 'Cangrejal', 'Sabanillas'],
    Alajuelita: [
      'Alajuelita',
      'San Josecito',
      'San Antonio',
      'Concepción',
      'San Felipe',
    ],
    Aserrí: [
      'Aserrí',
      'Tarbaca',
      'Vuelta de Jorco',
      'San Gabriel',
      'Legua',
      'Monterrey',
      'Salitrillos',
    ],
    Central: [
      'Carmen',
      'Merced',
      'Hospital',
      'Catedral',
      'Zapote',
      'San Francisco de Dos Ríos',
      'Uruca',
      'Mata Redonda',
      'Pavas',
      'Hatillo',
      'San Sebastián',
    ],
    Curridabat: ['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases'],
    Desamparados: [
      'Desamparados',
      'San Miguel',
      'San Juan de Dios',
      'San Rafael Arriba',
      'San Antonio',
      'Frailes',
      'Patarrá',
      'San Cristóbal',
      'Rosario',
      'Damas',
      'San Rafael Abajo',
      'Gravilias',
      'Los Guido',
    ],
    Dota: ['Santa María', 'Jardín', 'Copey'],
    Escazú: ['Escazú', 'San Antonio', 'San Rafael'],
    Goicoechea: [
      'Guadalupe',
      'San Francisco',
      'Calle Blancos',
      'Mata de Plátano',
      'Ipís',
      'Rancho Redondo',
      'Purral',
    ],
    'León Cortés Castro': [
      'San Pablo',
      'San Andrés',
      'Llano Bonito',
      'San Isidro',
      'Santa Cruz',
      'San Antonio',
    ],
    'Montes de Oca': ['San Pedro', 'Sabanilla', 'Mercedes', 'San Rafael'],
    Mora: [
      'Colón',
      'Guayabo',
      'Tabarcia',
      'Piedras Negras',
      'Picagres',
      'Jaris',
      'Quitirrisí',
    ],
    Moravia: ['San Vicente', 'San Jerónimo', 'La Trinidad'],
    'Pérez Zeledón': [
      'San Isidro de El General',
      'El General',
      'Daniel Flores',
      'Rivas',
      'San Pedro',
      'Platanares',
      'Pejibaye',
      'Cajón',
      'Barú',
      'Río Nuevo',
      'Páramo',
      'La Amistad',
    ],
    Puriscal: [
      'Santiago',
      'Mercedes Sur',
      'Barbacoas',
      'Grifo Alto',
      'San Rafael',
      'Candelarita',
      'Desamparaditos',
      'San Antonio',
      'Chires',
    ],
    'Santa Ana': [
      'Santa Ana',
      'Salitral',
      'Pozos',
      'Uruca',
      'Piedades',
      'Brasil',
    ],
    Tarrazú: ['San Marcos', 'San Lorenzo', 'San Carlos'],
    Tibás: [
      'San Juan',
      'Cinco Esquinas',
      'Anselmo Llorente',
      'León XIII',
      'Colima',
    ],
    Turrubares: [
      'San Pablo',
      'San Pedro',
      'San Juan de Mata',
      'San Luis',
      'Carara',
    ],
    'Vázquez de Coronado': [
      'San Isidro',
      'San Rafael',
      'Dulce Nombre de Jesús',
      'Patalillo',
      'Cascajal',
    ],
  },
} as const satisfies Readonly<Record<string, CantonDistricts>>;

/**
 * Legacy canton values that were persisted before the hierarchy existed.
 * Maps `province -> legacy canton -> canonical canton`.
 */
export const LOCATION_CANTON_ALIASES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  'San José': { 'San José': 'Central' },
} as const;

const toOptions = (values: readonly string[]): readonly CustomSelectOption[] =>
  values.map((value) => ({ label: value, value }));

const getCantons = (province: string): CantonDistricts | undefined =>
  (COSTA_RICA_LOCATIONS as Readonly<Record<string, CantonDistricts>>)[province];

const resolveCanton = (province: string, canton: string): string =>
  LOCATION_CANTON_ALIASES[province]?.[canton] ?? canton;

export const getProvinceOptions = (): readonly CustomSelectOption[] =>
  toOptions(Object.keys(COSTA_RICA_LOCATIONS));

export const getCantonOptions = (
  province: string | undefined,
): readonly CustomSelectOption[] => {
  const cantons = province ? getCantons(province) : undefined;
  return cantons ? toOptions(Object.keys(cantons)) : [];
};

export const getDistrictOptions = (
  province: string | undefined,
  canton: string | undefined,
): readonly CustomSelectOption[] => {
  if (!province || !canton) {
    return [];
  }
  const districts = getCantons(province)?.[resolveCanton(province, canton)];
  return districts ? toOptions([...districts, LOCATION_OTHER_OPTION]) : [];
};

export const isValidLocationHierarchy = (
  province: string,
  canton: string,
  district: string,
): boolean =>
  getCantonOptions(province).some(
    (option) => option.value === resolveCanton(province, canton),
  ) &&
  getDistrictOptions(province, canton).some(
    (option) => option.value === district,
  );

export const isValidCantonForProvince = (
  province: string,
  canton: string,
): boolean =>
  getCantonOptions(province).some(
    (option) => option.value === resolveCanton(province, canton),
  );
