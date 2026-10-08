# BYC FastForm & CoriMotors Admin - Especificación de Diseño y Arquitectura

**Proyecto:** BYC FastForm (SaaS Ecosystem)  
**Plataformas Objetivo:** Web (Consola Súper Admin), iOS & Android (App React Native / Expo Go para Asesores)  
**Framework CSS:** Tailwind CSS (o NativeWind para Expo)  
**Idioma UI:** Español  
**Contexto de Negocio:** Herramienta interna de ventas para automatizar formularios de crédito bancario. 

---

## 1. Stack Tecnológico y Entorno de Trabajo

-   **Lenguaje Base:** TypeScript (Tipado estricto obligatorio en todo el proyecto).
-   **Entorno Backend:** Node.js.
-   **Desarrollo Móvil (Asesores):** React Native gestionado mediante **Expo Go** (Multiplataforma iOS/Android). Uso de `expo-print` para manejo nativo de PDFs.
-   **Desarrollo Web (Súper Admin):** Next.js o React SPA (Single Page Application).
-   **Base de Datos y Autenticación:** Supabase (Capa Gratuita - PostgreSQL). Manejo de Auth por roles (Asesor vs. Admin) mediante Row Level Security (RLS).
-   **Integraciones:** Cero integraciones con bancos reales. El catálogo financiero y de vehículos reside en la base de datos interna.

---

## 2. Identidad de Marca, Tipografía e Iconografía (Criptografía)

-   **Tipografía:** Sans-serif moderna, limpia y de alta legibilidad (ej. *Inter*, *Roboto*, o *SF Pro*).
-   **Logotipo (Header):**
    *   **Top Badge (Pill) - Móvil:** Fondo beige tenue (`#DEE8E0`), texto verde oscuro (`#3A5C45`). Contiene un ícono SVG de un vehículo y el texto "BUILD YOUR CREDIT".
    *   **Text Logo:** "B" (`#111111`), "Y" (`#C32727`), "C" (`#111111`), "FastForm" (`#111111`).
    *   **Logo Súper Admin (Web):** Ícono vectorial SVG de un vehículo de perfil dentro de un recuadro rojo con bordes redondeados. Texto "CORIMOTORS" en tipografía bold blanca y "SUPER ADMIN" en rojo corporativo debajo.
-   **Regla Criptográfica / Iconografía (CRÍTICA):** ESTRICTAMENTE CERO EMOJIS. El sistema utiliza exclusivamente imágenes vectoriales (SVG) monocromáticas o de dos tonos (ej. Lucide Icons, Feather) para garantizar nitidez matemática en cualquier resolución.

---

## 3. Paleta de Colores Global

| Elemento / Rol | Código Hex | Clases Tailwind (Ref) | Notas de Uso |
| :--- | :--- | :--- | :--- |
| **Fondo App Móvil** | `#F7F7F6` | `bg-gray-50` | Fondo principal para la aplicación móvil (off-white). |
| **Fondo Web Admin** | `#222222` | `bg-[#222222]` | Barra lateral (Sidebar) unificada del panel web de administración. |
| **Workspace Web Admin**| `#F8FAFC` | `bg-slate-50` | Fondo gris frío para los lienzos de trabajo central. |
| **Superficie Tarjetas Web** | `#FAF9F6` | `bg-stone-50` | Fondo beige claro para tarjetas de estadísticas. |
| **Superficie Tarjetas Móvil** | `#CCC7BD` | `bg-[#CCC7BD]` | Gris taupe cálido para tarjetas del historial. |
| **Superficie Inputs/Modales**| `#FFFFFF` | `bg-white` | Blanco puro para campos de texto, documentos PDF y fondos de modales. |
| **Acento Primario (CTAs)** | `#B91C1C` | `bg-red-700` | Botones de acción principal corporativos ("Guardar Coordenadas", "Bandeja de Aprobaciones"). |
| **Texto Primario** | `#111111` | `text-gray-900` | Encabezados, etiquetas y texto principal. |
| **Texto Secundario** | `#5A6B80` | `text-gray-500` | Subtítulos, placeholders y estados inactivos. |
| **Éxito / Aprobado** | `#10B981` | `text-emerald-500` | Píldoras de estado, Toasts de aprobación y checks. |
| **Variables Mapeadas** | `#EFF6FF` | `bg-blue-50` | Fondo con borde azul claro (`border-blue-400`) y texto azul oscuro (`text-blue-800`) para variables colocadas en el editor PDF. |

---

## 4. Sistema de Componentes y Ergonomía

-   **Botones (CTAs):** Radio de borde (border-radius) de `8px` para Web y `xl` para Móvil. Altura mínima de `48px` y ancho mínimo de `48px` (`min-h-[48px] min-w-[48px]`). Texto de alto contraste (blanco sobre rojo). Opacidad en estado deshabilitado `40%`.
-   **Prevención de Desbordamiento (Text Overflow):** Todos los botones y contenedores interactivos con texto deben incluir `text-center` y `flex-shrink` (o `numberOfLines`) para prevenir saltos de línea irregulares o desbordamiento horizontal en pantallas pequeñas.
-   **Inputs y Selectores:** Fondo `#FFFFFF`, Borde base `#A39F97`. Borde en estado activo/focus `#5A6B80`. Radio de borde `8px`.
-   **Accesibilidad (a11y) en Inputs:** Todos los componentes de entrada deben exponer su estado de error a lectores de pantalla (ej. `aria-invalid={true}` o `accessibilityState={{ invalid: true }}`).
-   **Tarjetas (Cards):** Sombra suave paralela (drop shadow). Radio de borde `16px` para contenedores principales y `2rem` para contenedores maestros en vistas móviles.
-   **Espaciado y Layout:** Cumplimiento estricto de la cuadrícula de 8 puntos (8px, 16px, 24px) para márgenes y paddings. 
-   **Accesibilidad Móvil (Touch Targets):** Área mínima de toque (Touch Target) para cualquier elemento interactivo (botones, íconos, links) es estrictamente de `48x48px` (ej. `min-h-[48px] min-w-[48px]` o uso de `hitSlop`).
-   **Idioma de Interfaz (100% Español):** TODO el texto visible para el usuario, placeholders, etiquetas, feedback de validación y mensajes de error DEBEN estar en español.

---

## 5. Reglas de Negocio y SLA (Service Level Agreement)

-   **Bloqueo de Impresión (Core Business Rule):** Un asesor NO puede imprimir ni generar documentos PDF de un trámite que no tenga el estado "APROBADO" por el Súper Administrador.
-   **Rendimiento de Generación (SLA):** La creación del documento PDF nativo debe tomar < 5 segundos. Utilizar spinners SVG durante la carga. Los botones deben decir "Generar Documento" o "Imprimir Formularios", evitando la frase "Guardar en Nube".
-   **Template Mapping (Admin):** Módulo central interactivo (Drag & Drop) que permite al Súper Administrador subir formularios bancarios oficiales en formato PDF y mapear coordenadas X/Y exactas. El sistema realiza un mapeo cruzado (Cross-Category Mapping), permitiendo vincular variables del JSON interno (Datos Personales, Vehículo, Financieros) con cualquier sección visual exigida por la entidad financiera, independientemente de su categoría lógica.

---

## 6. Arquitectura de Navegación

-   **Módulo Asesor (Móvil en Expo Go):**
    *   **Bottom Tab Navigator (Orden Estricto):** 1. `Historial` (Izquierda/Home), 2. `Nuevo Trámite` (Centro), 3. `Mi Perfil` (Derecha).
    *   **Campana de Notificaciones:** Ubicada en el Top Header (derecha). Despliega un modal flotante oscuro.
    *   **Stack Navigator:** Usado exclusivamente para flujos de alta concentración (Wizard y Gestor de Impresión) ocultando la barra inferior temporalmente.
-   **Módulo Súper Admin (Web):**
    *   **Layout Base:** Sidebar oscuro a la izquierda (`bg-[#222222]`) encabezado por el logotipo corporativo, y área de trabajo principal clara a la derecha (`bg-slate-50`).
    *   **Rutas Principales (Sidebar bajo "OPERACIONES"):**
        1. `Bandeja de Aprobaciones` (Activo por defecto, fondo rojo `#B91C1C`).
        2. `Usuarios y Permisos` (Inactivo, texto grisáceo).
        3. `Catálogos y Parametría` (Inactivo, texto grisáceo).
        4. `Plantillas PDF` (Inactivo, texto grisáceo).
    *   **Feedback Visual:** Toast Notifications flotantes (arriba a la derecha) y modales centralizados con overlay oscuro para acciones de aprobación o rechazo.

---

## 7. Definición de Pantallas: Asesor (App Móvil)

-   **Pantalla 0 (Autenticación):** Inputs de correo/contraseña. Dirige directamente a la pantalla "Historial".
-   **Pantalla 1 (Historial / Home):** Tarjetas con trámites previos. Muestra píldoras de estado (Pendiente, Aprobado, Rechazado). Trámites aprobados muestran ícono de impresora.
-   **Pantalla 2 (Notificaciones):** Modal desplegable desde la campana en el header. 
-   **Pantalla 3 (Wizard "Nuevo Trámite"):** Formulario secuencial. Barra de progreso superior. Opción de guardar borrador. Renderiza imágenes de vehículos desde Supabase en tiempo real.
-   **Pantalla 4 (Gestor de Impresión):** Verificación final estructurada en 4 pasos lógicos (Datos Empresa, Domicilio, Referencias, Checklists) antes de habilitar la impresión.
-   **Pantalla 5 (Mi Perfil):** Tarjetas de métricas de ventas. Toggle de apariencia, reporte de problemas mediante modal y cierre de sesión.

---

## 8. Definición de Pantallas: Súper Admin (Consola Web)

-   **Bandeja de Aprobaciones (Dashboard):** Tarjetas KPI superiores categorizadas (Hoy, Semana Actual, Semana Anterior) mostrando totales de solicitudes Aprobadas, Rechazadas y Pendientes[cite: 20]. Tabla central inferior con la lista de solicitudes y acciones rápidas[cite: 20].
-   **Estado Vacío (Empty State):** Contenedor centralizado limpio con ícono gris circular de confirmación (check) y el texto "Todo al día" seguido de "No hay trámites pendientes de revisión en este momento", ocultando la tabla de datos[cite: 20].
-   **Modal Dossier (Ver Detalles):** Vista ancha a 3 columnas cruzando datos críticos (Perfil Solicitante, Vehículo/Asesor, Plan Financiamiento) para auditoría rápida.
-   **Flujos de Aprobación/Rechazo:** El rechazo exige forzosamente seleccionar un "Motivo". 
-   **Catálogos y Usuarios:** Modales para creación de sucursales, generación de credenciales de asesores y subida de logotipos bancarios en formato SVG.
-   **Gestor de Plantillas PDF (Listado):** Tabla de administración que muestra los formularios bancarios disponibles (ej. SUGEF CIC-01), su versión, el estado (Activo/Inactivo) mediante píldoras, y botones de acción rápida para "Editar Mapeo", "Configurar" o "Subir Nueva Plantilla".
-   **Editor Drag & Drop (Workspace PDF):** Pantalla de alta fidelidad para mapeo de variables:
    *   **Barra Superior (Header):** Migas de pan estructuradas (`Consola > Plantillas PDF > Editor: Formulario...`), flanqueadas a la derecha por acciones secundarias ("Probar Plantilla") y primarias ("Guardar Coordenadas"), más la campana de notificaciones y el avatar del usuario. 
    *   **Barra Lateral Izquierda (Acordeón):** Integra un buscador de variables y un sistema de secciones expandibles/colapsables (`DATOS PERSONALES`, `DATOS DEL VEHÍCULO`, `DATOS FINANCIEROS`, `FIRMAS Y METADATOS`). Las secciones colapsadas mantienen un diseño minimalista limpio. Las expandidas muestran píldoras arrastrables con un *grip* de 6 puntos a la izquierda y la llave técnica a la derecha. La barra finaliza en la parte inferior con un botón en contenedor oscuro (`← Volver a Plantillas PDF`) para salir del flujo de edición.
    *   **Lienzo Central (Canvas):** Contenedor de visualización del documento PDF real, con soporte para *scroll*. Las variables arrastradas se posicionan como píldoras azules que incluyen el nombre del campo y un botón "X" para remover, mostrando con exactitud el layout de impresión final.

---

## 9. Esquema de Datos Base (Estructura JSON / TypeScript)

La UI del "Master Draft" y el "Dossier" debe mapearse contra estas interfaces estrictas:

-   **Tipo de Entidad:** `['Físico', 'Jurídico']`
-   **Datos Personales:** `nombreCompleto`, `tipoIdentificacion`, `numeroIdentificacion`, `fechaNacimiento`, `nacionalidad`, `estadoCivil`, `genero`.
-   **Datos Empresa:** `razonSocial`, `cedulaJuridica`, `actividadComercial`, `fechaConstitucion`, `representanteLegal`.
-   **Contacto:** `correo`, `telefonos`, `provincia`, `canton`, `distrito`, `direccionExacta`.
-   **Laboral:** `condicionLaboral`, `empresaPatrono`, `ingresoBruto`, `ingresoNeto`.
-   **Vehículo:** `marca`, `modelo`, `valorTotal`, `montoPrima`, `montoFinanciar`.
-   **Autorizaciones:** Campos booleanos obligatorios para consulta de Buró de Crédito y directrices SUGEF/CIC.