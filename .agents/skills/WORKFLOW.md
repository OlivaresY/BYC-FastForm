# BYC FastForm - Spec-Driven Development (SDD) Workflow

Este documento define el flujo de trabajo estricto que todos los agentes de IA (Antigravity) deben seguir al desarrollar nuevas funcionalidades para BYC FastForm (Web o Móvil).

## 1. Regla de Oro: Cero Código a Ciegas
El agente tiene **ESTRICTAMENTE PROHIBIDO** generar, modificar o sugerir archivos de código fuente (`.ts`, `.tsx`, `.sql`) basados únicamente en un prompt inicial. Toda implementación debe pasar primero por la fase de Especificación (Spec).

## 2. El Flujo SDD (Spec-Driven Development)

### Paso 1: Generación del Spec (Draft)
Cuando el usuario solicite una nueva funcionalidad (ej. "Crear el login de asesores"), el agente debe:
1. Leer los lineamientos en `.agents/DESIGN.md` y `.agents/ARCHITECTURE.md`.
2. Generar un bloque de markdown llamado **[SPECIFICATION DRAFT]**.
3. El Draft debe contener:
   - **Objetivo:** Qué se va a construir.
   - **Estructura de Archivos:** Qué archivos exactos se crearán o modificarán siguiendo la arquitectura FSD (Feature-Sliced Design) y MVVM.
   - **Tipos de Datos (Interfaces):** Qué contratos TypeScript se necesitan en la capa `/types`.
   - **Lógica de Estado:** Qué hooks conformarán el ViewModel.
   - **Dependencias Externas:** Si requiere modificaciones en Supabase.
4. Pausar la ejecución y **preguntar explícitamente al usuario**: *"¿Apruebas esta especificación o deseas hacer ajustes antes de generar el código?"*.

### Paso 2: Implementación (Solo tras aprobación)
Una vez que el usuario responde afirmativamente al Spec Draft:
1. El agente generará los archivos en un orden lógico (bottom-up):
   - Primero: `/types` (Interfaces).
   - Segundo: `/services` (Llamadas a BD / Model).
   - Tercero: `/hooks` (ViewModel y estado local).
   - Cuarto: `/components` (Views UI en Tailwind/NativeWind).
2. Cada archivo generado debe compilar de forma aislada sin dejar "tipos any" o código a medias.

### Paso 3: GitFlow y Entregables
- El agente sugerirá el comando de Git para crear una nueva rama: `git checkout -b feature/nombre-corto`.
- Al finalizar, el agente debe generar un mensaje de commit semántico (Conventional Commits) detallando los cambios.

## 3. Resolución de Errores (Troubleshooting)
Si un error de compilación o de linting ocurre durante el desarrollo:
- El agente **NO** debe intentar adivinar arreglos rápidos (hotfixes) parcheando componentes de UI.
- Debe analizar el error, trazarlo hasta su origen en el `ViewModel` (Hooks) o el `Model` (Types/Services), y arreglar la raíz del problema respetando el tipado estricto.