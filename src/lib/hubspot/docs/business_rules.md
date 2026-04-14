# Business Rules Documentation
# Reglas de Negocio - Cotización Process

## Overview
This document defines the business rules for cotización state transitions and automation.

---

## State Machine Rules

### 1. Levantando Precio
**When:** Initial quote request received

**Required Fields:**
- producto_cotizado
- incoterm
- tipo_cliente_operacion

**Auto-Actions:**
- ✅ Create internal task: "Conseguir precio base" (24h deadline)
- ✅ Create activity note
- ⚠️ Email to client: ONLY if they want confirmation

**Validation Rules:**
- ❌ Cannot advance if required fields are missing
- ❌ Mark as incomplete if any key field is absent

---

### 2. Validando Logística
**When:** Base price found, validating logistics

**Required Fields:**
- mercado_origen (must be defined)
- puerto_salida (must be defined)

**Auto-Actions:**
- ✅ Create internal task: "Validar logística completa" (24h deadline)
- ✅ Create activity note
- ⚠️ Email to client: ONLY for visibility

**Validation Rules:**
- ⚠️ Alert if >24h in this state without change
- Create internal reminder for delay

---

### 3. Preparando Cotización Formal
**When:** Price and logistics validated

**Required Fields:**
- producto_cotizado
- incoterm
- tipo_cliente_operacion
- mercado_origen
- puerto_salida

**Auto-Actions:**
- ✅ Create internal task: "Emitir cotización formal" (24h deadline)
- ✅ Create activity note
- ❌ NO email to client

**Validation Rules:**
- ❌ Cannot advance to "cotizacion_enviada" without formal document generated
- ❌ Cannot advance without evidence of sending

---

### 4. Cotización Enviada ⭐ CRITICAL
**When:** Formal quote sent to client

**Auto-Actions:**
- ✅ **AUTOMATIC EMAIL to client** (most important email)
- ✅ Create follow-up task at 48h
- ✅ Create activity note
- ✅ Set fecha_envio_cotizacion automatically (YYYY-MM-DD)

**Required Fields:**
- contactEmail OR contactId (must exist)

**Validation Rules:**
- ✅ Auto-set fecha_envio_cotizacion to current date
- ⚠️ Use fecha_envio_cotizacion for "no response in 48h" tracking

**Email Template:**
```
Subject: Cotización formal – {{producto}} – {{incoterm}}

Estimado/a {{nombre}},
compartimos la cotización formal correspondiente a su solicitud.
Quedamos atentos a sus comentarios y confirmación.
Saludos.
```

---

### 5. En Negociación
**When:** Client responded or discussing adjustments

**Auto-Actions:**
- ✅ Create internal task to track adjustments
- ✅ Create activity note
- ❌ NO automatic email (manual follow-up preferred)

**Validation Rules:**
- No special requirements

---

### 6. Ganada
**When:** Quote accepted and closed

**Auto-Actions:**
- ✅ Email to client: Confirmation and next steps
- ✅ Create activity note
- ✅ Close open tasks

**Validation Rules:**
- Should close all open tasks before marking as won

---

### 7. Perdida
**When:** Quote rejected or expired

**Auto-Actions:**
- ⚠️ Email to client: OPTIONAL (thank you or future follow-up)
- ✅ Create activity note with reason
- ✅ Close open tasks

**Validation Rules:**
- Should record reason for loss

---

## Global Business Rules

### BR-001: Use Current Object Name
- **Rule:** Use object `0-3` with business name "Cotización/Cotizaciones"
- **Do NOT use:** "Deals" in new functional logic

### BR-002: No Inventing Enum Values
- **Rule:** AI can only write values included in `allowed_values` for enumeration properties
- **Valid estados:** levantando_precio, validando_logistica, preparando_cotizacion_formal, cotizacion_enviada, en_negociacion, ganada, perdida
- **Valid productos:** azucar, chicken_paws, otro
- **Valid incoterms:** fob, cif, cfr, exw, otro
- **Valid tipo_cliente:** cliente_directo, otro_broker

### BR-003: Automatic Date on Send
- **Rule:** If estado_cotizacion changes to 'cotizacion_enviada', must set fecha_envio_cotizacion with current date in YYYY-MM-DD format

### BR-004: Validate Minimum Associations
- **Rule:** Before marking a quote as sent, verify at least one related contact or company exists

### BR-005: Do Not Overwrite Without Reason
- **Rule:** AI should not overwrite already-completed fields without explicit instruction or defined functional rule

---

## State Transition Flow

```
levantando_precio
    ↓
validando_logistica
    ↓
preparando_cotizacion_formal
    ↓
cotizacion_enviada ⭐ (auto-sets fecha_envio)
    ↓
en_negociacion (optional, can loop back)
    ↓
ganada OR perdida (terminal states)
```

**Invalid Transitions:**
- Cannot skip states
- Cannot go backwards (except en_negociacion ↔ cotizacion_enviada)
- Cannot change from terminal states (ganada, perdida)

---

## Data Validation Rules

### Before Creating Cotizacion
1. producto_cotizado is required and valid
2. incoterm is required and valid
3. tipo_cliente_operacion is required and valid
4. contactEmail OR contactId must exist
5. Email format is valid if provided

### Before State Change
1. Current state must allow transition to new state
2. Required fields for new state must be populated
3. Must log the state change with timestamp and user

### After State Change
1. Create activity note documenting the change
2. Create follow-up tasks if configured
3. Send emails if configured for this state

---

## Error Handling

### HubSpot API Failures
- Log error but don't fail user request
- Retry once for critical operations
- Alert internal team if persistent failure

### Validation Failures
- Return clear error message with field name
- Do not proceed with state transition
- Allow user to correct and retry

### Email Failures
- Log failure but don't block state transition
- Queue for retry if temporary failure
- Alert if permanent failure

---

## Timezone and Dates

- **System timezone:** America/Caracas (UTC-4)
- **Date format:** YYYY-MM-DD for fecha_envio_cotizacion
- **Timestamp format:** ISO 8601 for createdate, updatedate
- **Follow-up deadlines:**
  - Levantando precio: 24 hours
  - Validando logística: 24 hours
  - Preparando cotización: 24 hours
  - Cotización enviada: 48 hours follow-up

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-04-13  
**Maintained By:** J Huge International Development Team
