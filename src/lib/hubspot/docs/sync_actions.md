# Sync Actions Documentation
# Acciones de Sincronización - HubSpot Integration

## Overview
This document defines all available sync actions between the webapp and HubSpot CRM.

---

## Architecture Principle

**Webapp = Operational Engine**  
**HubSpot = System of Record**

The webapp handles:
- Business logic
- State transitions
- Email automation
- Task management

HubSpot handles:
- Contact storage
- Company storage
- Cotización records
- Historical tracking
- Reporting and views

---

## Available Actions

### 1. CREATE_CONTACT
**Purpose:** Create or update a contact in HubSpot

**Endpoint:** `POST /crm/v3/objects/contacts`

**Input:**
```typescript
{
  email: string;           // Required, unique identifier
  firstName?: string;
  lastName?: string;
  phone?: string;
  rolenla_operacion?: 'comprador' | 'broker' | 'logistica' | 'finanzas' | 'otro';
}
```

**Behavior:**
1. Search for existing contact by email
2. If found, return existing contact ID
3. If not found, create new contact
4. Return contact object with HubSpot ID

**Example:**
```typescript
const contact = await HubSpotService.contacts.findOrCreate({
  email: 'client@example.com',
  firstName: 'John',
  lastName: 'Doe',
  rolenla_operacion: 'comprador',
});
```

**Output:**
```json
{
  "id": "1234567890",
  "properties": {
    "email": "client@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "rolenla_operacion": "comprador"
  }
}
```

---

### 2. CREATE_COMPANY
**Purpose:** Create or update a company in HubSpot

**Endpoint:** `POST /crm/v3/objects/companies`

**Input:**
```typescript
{
  name: string;            // Required
  domain?: string;
  country?: string;
  industry?: string;
}
```

**Behavior:**
1. Search for existing company by domain (if provided)
2. If found, return existing company
3. If not found, create new company
4. Return company object with HubSpot ID

**Example:**
```typescript
const company = await HubSpotService.companies.create({
  name: 'Client Corp',
  domain: 'clientcorp.com',
  country: 'Spain',
});
```

---

### 3. CREATE_COTIZACION
**Purpose:** Create a new cotización (custom object 0-3)

**Endpoint:** `POST /crm/v3/objects/0-3`

**Input:**
```typescript
{
  producto_cotizado: 'azucar' | 'chicken_paws' | 'otro';  // Required
  incoterm: 'fob' | 'cif' | 'cfr' | 'exw' | 'otro';      // Required
  tipo_cliente_operacion: 'cliente_directo' | 'otro_broker'; // Required
  
  mercado_origen?: string;
  puerto_salida?: string;
  
  estado_cotizacion?: 'levantando_precio' | ...; // Defaults to 'levantando_precio'
  
  contactId?: string;      // HubSpot contact ID
  contactEmail?: string;   // Alternative to contactId
  companyId?: string;      // HubSpot company ID
  
  amount?: string | number;
  description?: string;
  notes?: string;
}
```

**Behavior:**
1. Validate all required fields
2. Validate enum values
3. Auto-generate dealname if not provided
4. Set default estado_cotizacion to 'levantando_precio'
5. Associate with contact and/or company if provided
6. Create cotización in HubSpot
7. Return cotización object with ID

**Example:**
```typescript
const cotizacion = await HubSpotService.cotizaciones.create({
  producto_cotizado: 'azucar',
  incoterm: 'cif',
  tipo_cliente_operacion: 'cliente_directo',
  mercado_origen: 'Brazil',
  contactEmail: 'client@example.com',
  amount: 500,
  description: 'ICUMSA 45 white sugar',
});
```

**Output:**
```json
{
  "id": "987654321",
  "properties": {
    "dealname": "azucar — 500 MT (cif)",
    "producto_cotizado": "azucar",
    "incoterm": "cif",
    "tipo_cliente_operacion": "cliente_directo",
    "estado_cotizacion": "levantando_precio",
    "mercado_origen": "Brazil",
    "amount": "500"
  }
}
```

---

### 4. UPDATE_COTIZACION_STATUS
**Purpose:** Update cotización state (most common operation)

**Endpoint:** `PATCH /crm/v3/objects/0-3/{id}`

**Input:**
```typescript
{
  id: string;                          // Cotización ID
  estado_cotizacion: EstadoCotizacion; // New state
  skipAutoDate?: boolean;              // Optional, default false
}
```

**Behavior:**
1. Validate state transition is allowed
2. Run business rule validations
3. If new state is 'cotizacion_enviada', auto-set fecha_envio_cotizacion to today (unless skipAutoDate=true)
4. Update estado_cotizacion in HubSpot
5. Create activity note documenting the change
6. Create follow-up tasks if configured
7. Send emails if configured for this state
8. Return updated cotización

**Example:**
```typescript
const result = await CotizacionStateMachine.transition(
  '987654321',
  'cotizacion_enviada',
  {
    userId: 'user@jhi.com',
    userReason: 'Formal quote sent to client',
  }
);
```

**Output:**
```json
{
  "success": true,
  "previousState": "preparando_cotizacion_formal",
  "newState": "cotizacion_enviada",
  "actions": {
    "emailSent": true,
    "taskCreated": true,
    "noteCreated": true
  }
}
```

---

### 5. UPDATE_COTIZACION_PROPERTIES
**Purpose:** Update cotización fields without changing state

**Endpoint:** `PATCH /crm/v3/objects/0-3/{id}`

**Input:**
```typescript
{
  id: string;
  producto_cotizado?: ProductoCotizado;
  incoterm?: Incoterm;
  tipo_cliente_operacion?: TipoClienteOperacion;
  puerto_salida?: string;
  mercado_origen?: string;
  amount?: string | number;
  description?: string;
  notes?: string;
}
```

**Behavior:**
1. Validate enum values if provided
2. Only update provided fields
3. Do NOT overwrite existing values unless explicitly provided
4. Return updated cotización

**Example:**
```typescript
const updated = await HubSpotService.cotizaciones.update('987654321', {
  puerto_salida: 'Santos',
  mercado_origen: 'Brazil',
});
```

---

### 6. CREATE_NOTE
**Purpose:** Create activity note and associate with cotización

**Endpoint:** `POST /crm/v3/objects/notes`

**Input:**
```typescript
{
  content: string;           // Required
  cotizacionId: string;      // Required for association
  userId?: string;           // Who made the change
}
```

**Behavior:**
1. Create note in HubSpot
2. Associate with cotización
3. Return note object

**Example:**
```typescript
const note = await HubSpotService.activities.createNote({
  content: 'Estado cambiado: Preparando cotización formal → Cotización enviada\nUsuario: admin@jhi.com\nFecha: 2026-04-13T10:30:00Z',
  cotizacionId: '987654321',
});
```

---

### 7. CREATE_TASK
**Purpose:** Create follow-up task and associate with cotización

**Endpoint:** `POST /crm/v3/objects/tasks`

**Input:**
```typescript
{
  title: string;             // Required
  description?: string;
  dueDate?: string;          // YYYY-MM-DD
  cotizacionId: string;      // Required for association
  assignTo?: string;         // Owner email
}
```

**Behavior:**
1. Create task in HubSpot
2. Set due date if provided
3. Associate with cotización
4. Return task object

**Example:**
```typescript
const task = await HubSpotService.activities.createTask({
  title: '[Cotización Enviada] Follow-up: Verificar respuesta del cliente',
  description: 'Contactar al cliente para verificar recepción y resolver dudas',
  dueDate: '2026-04-15',
  cotizacionId: '987654321',
});
```

---

### 8. GET_COTIZACIONES_BY_CONTACT
**Purpose:** Retrieve all cotizaciones for a contact

**Endpoint:** `GET /crm/v3/objects/contacts/{id}/associations/0-3`

**Input:**
```typescript
{
  email: string;             // Contact email
}
```

**Behavior:**
1. Find contact by email
2. Get associated cotizaciones
3. Fetch full details for each cotización
4. Return array of cotización objects

**Example:**
```typescript
const cotizaciones = await HubSpotService.cotizaciones.getByContactEmail('client@example.com');
```

**Output:**
```json
[
  {
    "id": "987654321",
    "properties": {
      "dealname": "azucar — 500 MT (cif)",
      "estado_cotizacion": "cotizacion_enviada",
      "fechaenviocotizacion": "2026-04-13",
      "producto_cotizado": "azucar",
      "incoterm": "cif",
      "amount": "500",
      "createdate": "2026-04-12T10:00:00Z"
    }
  }
]
```

---

### 9. SEARCH_COTIZACIONES_BY_STATUS
**Purpose:** Find all cotizaciones in a specific state

**Endpoint:** `POST /crm/v3/objects/0-3/search`

**Input:**
```typescript
{
  status: EstadoCotizacion;
  limit?: number;            // Default 50
}
```

**Behavior:**
1. Search cotizaciones by estado_cotizacion
2. Sort by createdate descending
3. Return up to limit results

**Example:**
```typescript
const pending = await HubSpotService.cotizaciones.searchByStatus('cotizacion_enviada', 20);
```

---

### 10. ASSOCIATE_OBJECTS
**Purpose:** Create association between two HubSpot objects

**Endpoint:** `PUT /crm/v3/objects/{fromObjectType}/{fromId}/associations/{toObjectType}/{toId}/{associationTypeId}`

**Input:**
```typescript
{
  fromObjectType: string;    // e.g., '0-3' (cotizaciones)
  fromObjectId: string;
  toObjectType: string;      // e.g., '0-1' (contacts)
  toObjectId: string;
  associationTypeId: string; // HubSpot association type ID
}
```

**Behavior:**
1. Create association between objects
2. Return success/failure

**Example:**
```typescript
await HubSpotService.cotizaciones.associateWithContact('987654321', '1234567890');
```

---

## Action Sequences

### New Quote Request Flow
```
1. CREATE_CONTACT (find or create)
2. CREATE_COTIZACION (with contact association)
3. CREATE_NOTE (document the creation)
4. CREATE_TASK (follow-up task)
```

### State Transition Flow
```
1. VALIDATE_TRANSITION (check business rules)
2. UPDATE_COTIZACION_STATUS (change state)
3. CREATE_NOTE (document the change)
4. CREATE_TASK (follow-up if configured)
5. SEND_EMAIL (to client and/or internal if configured)
```

### Quote Status Lookup Flow
```
1. FIND_CONTACT_BY_EMAIL
2. GET_COTIZACIONES_BY_CONTACT
3. FORMAT_SUMMARY (for display to user)
```

---

## Error Handling

### Retry Logic
- All API calls retry once on network failure
- Exponential backoff: 1s, then 2s
- Log failure but don't block user request

### Conflict Resolution
- If contact already exists, reuse instead of creating
- If enum value invalid, return clear error with valid options
- If required field missing, return field name in error

### Idempotency
- CREATE_CONTACT is idempotent (searches before creating)
- UPDATE_STATUS is NOT idempotent (validates transition each time)
- CREATE_NOTE is NOT idempotent (creates new note each call)

---

## Rate Limiting

### HubSpot API Limits
- Free tier: 5 requests/second
- Daily limit: Varies by plan
- Monitor X-HubSpot-RateLimit headers

### Recommendations
- Batch operations when possible
- Cache frequently accessed data
- Use search instead of list+filter when available

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-04-13  
**Maintained By:** J Huge International Development Team
