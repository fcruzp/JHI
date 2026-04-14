// ============================================================
// HubSpot Integration - Types & Schemas
// ============================================================

// Enumeration types matching HubSpot custom object
export type EstadoCotizacion =
  | 'levantando_precio'
  | 'validando_logistica'
  | 'preparando_cotizacion_formal'
  | 'cotizacion_enviada'
  | 'en_negociacion'
  | 'ganada'
  | 'perdida';

export type ProductoCotizado =
  | 'azucar'
  | 'chicken_paws'
  | 'otro';

export type Incoterm =
  | 'fob'
  | 'cif'
  | 'cfr'
  | 'exw'
  | 'otro';

export type TipoClienteOperacion =
  | 'cliente_directo'
  | 'otro_broker';

export type RolEnLaOperacion =
  | 'comprador'
  | 'broker'
  | 'logistica'
  | 'finanzas'
  | 'otro';

// Human-readable labels
export const ESTADO_LABELS: Record<EstadoCotizacion, string> = {
  levantando_precio: 'Levantando precio',
  validando_logistica: 'Validando logística',
  preparando_cotizacion_formal: 'Preparando cotización formal',
  cotizacion_enviada: 'Cotización enviada',
  en_negociacion: 'En negociación',
  ganada: 'Ganada',
  perdida: 'Perdida',
};

export const PRODUCTO_LABELS: Record<ProductoCotizado, string> = {
  azucar: 'Azúcar',
  chicken_paws: 'Chicken paws',
  otro: 'Otro',
};

export const INCOTERM_LABELS: Record<Incoterm, string> = {
  fob: 'FOB',
  cif: 'CIF',
  cfr: 'CFR',
  exw: 'EXW',
  otro: 'Otro',
};

export const TIPO_CLIENTE_LABELS: Record<TipoClienteOperacion, string> = {
  cliente_directo: 'Cliente directo',
  otro_broker: 'Otro broker',
};

export const ROL_LABELS: Record<RolEnLaOperacion, string> = {
  comprador: 'Comprador',
  broker: 'Broker',
  logistica: 'Logística',
  finanzas: 'Finanzas',
  otro: 'Otro',
};

// HubSpot object type IDs
export const HUBSPOT_OBJECT_TYPES = {
  CONTACTS: '0-1',
  COMPANIES: '0-2',
  COTIZACIONES: '0-3', // Custom object (formerly Deals)
} as const;

// Association type IDs (HubSpot standard)
export const ASSOCIATION_TYPES = {
  CONTACT_TO_DEAL: '3', // Contact -> Deal association
  DEAL_TO_CONTACT: '4', // Deal -> Contact association
  COMPANY_TO_DEAL: '5', // Company -> Deal association
  DEAL_TO_COMPANY: '6', // Deal -> Company association
} as const;

// ============================================================
// Data Interfaces
// ============================================================

export interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  rol_en_la_operacion?: RolEnLaOperacion;
  companyId?: string;
}

export interface CompanyData {
  name: string;
  domain?: string;
  country?: string;
  industry?: string;
}

export interface CotizacionData {
  // Required for creation
  producto_cotizado: ProductoCotizado;
  producto_nombre_original?: string; // Original commodity name for dealname display
  incoterm: Incoterm;
  tipo_cliente_operacion: TipoClienteOperacion;
  
  // Optional but recommended
  mercado_origen?: string;
  puerto_salida?: string;
  
  // Auto-managed
  estado_cotizacion?: EstadoCotizacion; // Defaults to 'levantando_precio'
  fecha_envio_cotizacion?: string; // YYYY-MM-DD, auto-set when status changes to 'cotizacion_enviada'
  
  // Associations
  contactId?: string;
  companyId?: string;
  contactEmail?: string; // Alternative to contactId for lookup
  
  // Metadata
  dealName?: string; // Auto-generated if not provided
  amount?: string | number;
  description?: string;
  notes?: string;
}

export interface CotizacionUpdateData {
  estado_cotizacion?: EstadoCotizacion;
  fecha_envio_cotizacion?: string;
  producto_cotizado?: ProductoCotizado;
  incoterm?: Incoterm;
  tipo_cliente_operacion?: TipoClienteOperacion;
  puerto_salida?: string;
  mercado_origen?: string;
  amount?: string | number;
  description?: string;
  notes?: string;
}

export interface ActivityNote {
  content: string;
  cotizacionId: string;
  userId?: string; // Who made the change
}

export interface FollowUpTask {
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  cotizacionId: string;
  assignTo?: string; // Owner email
}

// ============================================================
// State Transition Result
// ============================================================

export interface TransitionResult {
  success: boolean;
  previousState: EstadoCotizacion;
  newState: EstadoCotizacion;
  errors?: string[];
  warnings?: string[];
  actions?: {
    emailSent?: boolean;
    taskCreated?: boolean;
    noteCreated?: boolean;
  };
}

// ============================================================
// Validation Errors
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export class ValidationException extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed: ' + errors.map(e => e.message).join(', '));
    this.name = 'ValidationException';
    this.errors = errors;
  }
}

// ============================================================
// HubSpot API Response Types
// ============================================================

export interface HubSpotObject {
  id: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  properties: Record<string, string | null>;
  associations?: {
    [key: string]: {
      results: Array<{ id: string; type: string }>;
    };
  };
}

export interface HubSpotPagedResponse {
  results: HubSpotObject[];
  paging?: {
    next?: {
      after?: string;
      link?: string;
    };
  };
}

export interface HubSpotError {
  status: string;
  message: string;
  correlationId?: string;
  category?: string;
  errors?: Array<{
    message: string;
    context?: Record<string, unknown>;
  }>;
}
