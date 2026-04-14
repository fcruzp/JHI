# Plan de Implementación: Panel Administrativo JHI - Fase 4

## 📊 Resumen Ejecutivo

**Objetivo:** Construir un panel administrativo web para gestión operativa de cotizaciones, sincronizado con HubSpot, diseñado para el equipo de backoffice.

**Principio de diseño:**
- HubSpot = Fuente de verdad (CRM)
- Panel Admin = Experiencia operativa diaria

---

## 🧩 Análisis: Lo que ya tenemos vs. Lo nuevo

### ✅ Ya Implementado (Phases 1-3)

| Componente | Estado |
|------------|--------|
| HubSpot Service Layer | ✅ CRUD completo |
| State Machine (7 estados cliente) | ✅ Validaciones + reglas |
| Email Automation | ✅ Resend + templates |
| API Routes | ✅ RESTful endpoints |
| Normalización de datos | ✅ Enums, validación |
| Contacto ↔ Cotización | ✅ Asociación automática |

### 🆕 Lo que el PRD de HubSpot agrega

| Componente | Detalle |
|------------|---------|
| **7 campos operativos nuevos** | `tipodeproceso`, `estadodelsuplidor`, `fechasolicituda_suplidor`, `fecharespuestadel_suplidor`, `estadodela_cotizacion`, `trial_solicitado`, `resultadodela_cotizacion` |
| **Doble sistema de estados** | Estados cliente (7) + Estados operativos (6) |
| **Panel administrativo** | Tabla + filtros + edición inline |
| **Vistas preconfiguradas** | 7 vistas rápidas por estado |
| **Enfoque en suplidor** | Flujo: contactar suplidor → recibir valores → cotizar |

---

## 🔄 Flujo Operativo Completo

### El proceso REAL de JHI (descubierto en el PRD):

```
┌─────────────────────────────────────────────────────────────┐
│ FLUJO OPERATIVO COMPLETO                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. CLIENTE solicita cotización (vía chat o formulario)      │
│    ↓                                                        │
│ 2. BACKOFFICE contacta al SUPLIDOR                          │
│    → estadodelsuplidor: pendiente → contactado              │
│    ↓                                                        │
│ 3. BACKOFFICE solicita valores al suplidor                  │
│    → estadodelsuplidor: esperando_valores                   │
│    → fechasolicituda_suplidor: [fecha]                      │
│    ↓                                                        │
│ 4. SUPLIDOR responde con precios                            │
│    → estadodelsuplidor: valores_recibidos                   │
│    → fecharespuestadel_suplidor: [fecha]                    │
│    ↓                                                        │
│ 5. BACKOFFICE prepara cotización formal                     │
│    → estadodela_cotizacion: en_preparacion → enviada        │
│    ↓                                                        │
│ 6. CLIENTE recibe cotización                                │
│    → estado_cotizacion: cotizacion_enviada (cliente-facing) │
│    ↓                                                        │
│ 7. CLIENTE decide:                                          │
│    a) Acepta → ganada                                       │
│    b) Pide trial → estadodela_cotizacion: aprobadaparatrial │
│       tipodeproceso: oportunidad_trial                      │
│    c) Rechaza → rechazada / perdida                         │
└─────────────────────────────────────────────────────────────┘
```

### Los DOS sistemas de estado:

| Sistema | Propósito | Estados |
|---------|-----------|---------|
| **`estado_cotizacion`** | Vista del CLIENTE | levantando_precio, validando_logistica, preparando_cotizacion_formal, cotizacion_enviada, en_negociacion, ganada, perdida |
| **`estadodela_cotizacion`** | Vista OPERATIVA interna | solicitud_recibida, en_preparacion, enviada, enrevisiondel_cliente, aprobadaparatrial, rechazada |

---

## 📦 Campos del Objeto Cotización en HubSpot

### Campos ya existentes (Phase 1-3):

| Campo | Tipo | Uso |
|-------|------|-----|
| `estado_cotizacion` | enum (7 valores) | Estado visible al cliente |
| `fecha_envio_cotizacion` | date | Fecha de envío |
| `producto_cotizado` | enum | azucar, chicken_paws, otro |
| `incoterm` | enum | fob, cif, cfr, exw, otro |
| `tipoclienteoperacion` | enum | cliente_directo, otro_broker |
| `puerto_salida` | string | Puerto |
| `mercado_origen` | string | País origen |

### Campos NUEVOS (PRD HubSpot):

| Campo | Tipo | Valores | Uso |
|-------|------|---------|-----|
| `tipodeproceso` | enum | cotizacion, oportunidad_trial | Fase del proceso |
| `estadodelsuplidor` | enum | pendienteporcontactar, contactado, esperando_valores, valores_recibidos | Progreso con suplidor |
| `fechasolicituda_suplidor` | date | - | Cuándo se pidió info al suplidor |
| `fecharespuestadel_suplidor` | date | - | Cuándo respondió el suplidor |
| `estadodela_cotizacion` | enum | solicitud_recibida, en_preparacion, enviada, enrevisiondel_cliente, aprobadaparatrial, rechazada | Estado operativo interno |
| `trial_solicitado` | boolean | true/false | Si pidió trial |
| `resultadodela_cotizacion` | enum | pendiente, ganadaparacontinuar, perdida | Resultado final |

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│                    PANEL ADMINISTRATIVO                     │
│                    (Frontend - Next.js)                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Tabla        │  │ Filtros      │  │ Vistas Rápidas   │  │
│  │ Cotizaciones │  │ Avanzados    │  │ Preconfiguradas  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Edición      │  │ Detalle      │  │ Historial de     │  │
│  │ Inline       │  │ Cotización   │  │ Cambios          │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↓ HTTPS                                           │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API (Next.js)                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ /api/admin/cotizaciones                              │  │
│  │ - GET: Listar con filtros                            │  │
│  │ - PATCH: Actualizar campos operativos                │  │
│  │ - GET/[id]: Detalle completo                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Validación + Normalización                           │  │
│  │ - Validar enums antes de enviar a HubSpot            │  │
│  │ - Validar fechas                                     │  │
│  │ - Validar booleanos                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Logging + Trazabilidad                               │  │
│  │ - Registrar quién hizo cada cambio                   │  │
│  │ - Registrar timestamp                                │  │
│  │ - Registrar valor anterior/nuevo                     │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓ HubSpot Service Layer                           │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                  HUBSPOT CRM (API)                          │
│                                                             │
│  • Objeto: Cotizaciones (0-3)                               │
│  • Propiedades: 14 campos (7 existentes + 7 nuevos)        │
│  • Asociaciones: Contactos, Empresas                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 MVP - Alcance de la Primera Versión

### Incluido en MVP:

- [x] **Autenticación simple** para panel admin (protegido por contraseña o solo accesible internamente)
- [ ] **Listado de cotizaciones** con todas las columnas relevantes
- [ ] **7 campos editables** desde el panel
- [ ] **Filtros básicos** (estado suplidor, estado cotización, resultado, trial)
- [ ] **Edición inline** en la tabla o drawer lateral
- [ ] **Sincronización bidireccional** con HubSpot
- [ ] **Mensajes de éxito/error** claros
- [ ] **Enlace directo** al deal en HubSpot
- [ ] **Vistas preconfiguradas** (7 vistas rápidas)

### Fuera del MVP (Fase 5+):

- Automatizaciones complejas
- Motor de reglas avanzadas
- Auditoría detallada
- Dashboards con gráficos
- Multi-rol granular
- Creación automática de tareas
- Migración automática cotización → oportunidad

---

## 📋 Requerimientos Funcionales Detallados

### 1. Tabla Principal

**Columnas:**
| Columna | Fuente | Editable |
|---------|--------|----------|
| Nombre cotización | Dealname | ❌ |
| Contacto | Asociado | ❌ |
| Empresa | Asociado | ❌ |
| Tipo de proceso | `tipodeproceso` | ✅ |
| Estado del suplidor | `estadodelsuplidor` | ✅ |
| Fecha solicitud | `fechasolicituda_suplidor` | ✅ |
| Fecha respuesta | `fecharespuestadel_suplidor` | ✅ |
| Estado cotización | `estadodela_cotizacion` | ✅ |
| Trial solicitado | `trial_solicitado` | ✅ |
| Resultado | `resultadodela_cotizacion` | ✅ |
| Última actualización | `updatedate` | ❌ |

### 2. Edición Rápida

**Opciones:**
- Dropdown inline para estados
- Datepicker para fechas
- Toggle para booleanos
- Badge de color por estado

### 3. Vistas Preconfiguradas

| Vista | Filtro |
|-------|--------|
| Pendientes por contactar | `estadodelsuplidor = pendienteporcontactar` |
| Esperando valores | `estadodelsuplidor = esperando_valores` |
| Listas para preparar | `estadodelsuplidor = valores_recibidos` |
| Cotizaciones enviadas | `estadodela_cotizacion = enviada` |
| Con trial solicitado | `trial_solicitado = true` |
| Perdidas | `resultadodela_cotizacion = perdida` |
| Convertidas a trial | `tipodeproceso = oportunidad_trial` |

### 4. Filtros

- Por estado del suplidor (dropdown multi-select)
- Por estado de cotización (dropdown multi-select)
- Por resultado (dropdown)
- Por trial solicitado (toggle)
- Por rango de fecha solicitud (date range)
- Por rango de fecha respuesta (date range)
- Por tipo de proceso (dropdown)

---

## 🎨 UX/UI Recomendada

### Pantalla Principal

```
┌─────────────────────────────────────────────────────────────┐
│  PANEL ADMINISTRATIVO - Cotizaciones                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [🔍 Buscar] [Filtros ▾] [Vistas ▾] [Exportar]             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ☐ Nombre          │ Contacto  │ Estado Suplidor │ ... │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ ☐ Azúcar 500 MT   │ Juan P.   │ [ValoresRecibidos▾]│...│ │
│  │ ☐ Granos 44 MT    │ Julissa G.│ [EsperandoValores▾]│...│ │
│  │ ☐ Chicken 1000 MT │ Empresa X │ [Contactado▾]      │...│ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [← Anterior]  Página 1 de 5  [Siguiente →]                │
└─────────────────────────────────────────────────────────────┘
```

### Convenciones Visuales

| Estado | Color |
|--------|-------|
| Pendiente / En espera | 🟡 Amarillo |
| En preparación / Contactado | 🔵 Azul |
| Valores recibidos / Ganada | 🟢 Verde |
| Bloqueado / Perdida / Rechazada | 🔴 Rojo |

---

## 🔐 Seguridad y Autenticación

### Opción Recomendada para MVP:

**Autenticación simple:**
- Página protegida con contraseña
- O solo accesible desde IPs internas
- Sin sistema de usuarios complejo inicialmente

**Para Fase 5+:**
- NextAuth con roles (admin, operador, solo-lectura)
- Auditoría por usuario

---

## 📊 Lógica Operativa - Reglas Sugeridas

### Reglas de validación:

| Regla | Acción |
|-------|--------|
| Si `estadodelsuplidor = esperando_valores` → `fechasolicituda_suplidor` debe existir | ⚠️ Advertencia |
| Si `estadodelsuplidor = valores_recibidos` → `fecharespuestadel_suplidor` debe existir | ⚠️ Advertencia |
| Si `trial_solicitado = true` → `tipodeproceso` debería cambiar a `oportunidad_trial` | 💡 Sugerencia |
| Si `resultadodela_cotizacion = perdida` → Estado operativo cierra | 🔒 Bloqueo suave |

### Reglas de transición:

```
solicitud_recibida
    ↓
en_preparacion (cuando estadodelsuplidor = valores_recibidos)
    ↓
enviada (cuando se envía al cliente)
    ↓
enrevisiondel_cliente (esperando decisión)
    ↓
    ├→ aprobadaparatrial → tipodeproceso: oportunidad_trial
    ├→ ganadaparacontinuar
    └→ rechazada
```

---

## 🛠️ Plan de Implementación - Tareas

### Semana 1: Setup y Campos

- [ ] **Paso 1:** Verificar que los 7 campos nuevos existen en HubSpot
- [ ] **Paso 2:** Si no existen, crearlos vía API (con permisos correctos)
- [ ] **Paso 3:** Actualizar `types.ts` con los nuevos tipos
- [ ] **Paso 4:** Actualizar `service.ts` para leer/escribir los nuevos campos

### Semana 2: Backend API

- [ ] **Paso 5:** Crear `/api/admin/cotizaciones` (GET con filtros)
- [ ] **Paso 6:** Crear `/api/admin/cotizaciones/[id]` (GET detalle)
- [ ] **Paso 7:** Crear `/api/admin/cotizaciones/[id]` (PATCH actualización)
- [ ] **Paso 8:** Implementar validación de campos antes de enviar a HubSpot
- [ ] **Paso 9:** Implementar logging de cambios

### Semana 3: Frontend - Listado

- [ ] **Paso 10:** Crear página `/admin/cotizaciones`
- [ ] **Paso 11:** Implementar tabla con datos de HubSpot
- [ ] **Paso 12:** Implementar filtros
- [ ] **Paso 13:** Implementar vistas preconfiguradas
- [ ] **Paso 14:** Implementar paginación

### Semana 4: Frontend - Edición

- [ ] **Paso 15:** Implementar edición inline (dropdowns, datepickers, toggles)
- [ ] **Paso 16:** Implementar drawer lateral de detalle
- [ ] **Paso 17:** Implementar badges de color por estado
- [ ] **Paso 18:** Implementar mensajes de éxito/error
- [ ] **Paso 19:** Implementar enlace directo a HubSpot

### Semana 5: Testing y Deploy

- [ ] **Paso 20:** Testing end-to-end
- [ ] **Paso 21:** Validar sincronización bidireccional
- [ ] **Paso 22:** Deploy a producción
- [ ] **Paso 23:** Capacitación del equipo

---

## 📝 Checklist de Aceptación

- [ ] CA1: Usuario ve lista de cotizaciones desde HubSpot
- [ ] CA2: Usuario edita cualquiera de los 7 campos desde la app
- [ ] CA3: Cambios se reflejan en HubSpot
- [ ] CA4: App impide valores inválidos
- [ ] CA5: Usuario puede filtrar por estado suplidor, estado cotización, resultado, trial
- [ ] CA6: Interfaz es más simple que HubSpot para administración

---

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Edición simultánea desde HubSpot y app | Timestamp de última actualización + refresh automático |
| Errores por valores internos incorrectos | Validación estricta antes de enviar |
| Token de HubSpot expira | Refresh token automático + alerta |
| Futura necesidad de auditoría | Registrar cambios en base de datos local (Fase 5) |
| Expansión a oportunidad/trial | Diseñar campos para soportar ambas fases |

---

## 🚀 Próximos Pasos Inmediatos

1. **Verificar campos en HubSpot** → Ejecutar script de verificación
2. **Crear campos faltantes** → Si no existen, crearlos con permisos correctos
3. **Actualizar types.ts** → Agregar tipos para los 7 campos nuevos
4. **Actualizar service.ts** → Agregar métodos para leer/escribir campos operativos
5. **Empezar backend** → Crear API routes para el panel admin

---

**Documento preparado para:** J Huge International  
**Fecha:** 2026-04-15  
**Versión:** 1.0.0  
**Estado:** Listo para implementación  
**Próximo chat:** Iniciar con Paso 1 (verificación de campos)
