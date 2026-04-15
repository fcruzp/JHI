// ============================================================
// HubSpot Service - Main Integration Layer
// Handles all CRUD operations for Contacts, Companies, and Cotizaciones
// ============================================================

import {
  ContactData,
  CompanyData,
  CotizacionData,
  CotizacionUpdateData,
  ActivityNote,
  FollowUpTask,
  HubSpotObject,
  HubSpotPagedResponse,
  HubSpotError,
  HUBSPOT_OBJECT_TYPES,
  ASSOCIATION_TYPES,
  EstadoCotizacion,
  TipoDeProceso,
  EstadoDelSuplidor,
  EstadoOperativoCotizacion,
  ResultadoDeCotizacion,
  PRODUCTO_LABELS,
} from './types';

const HUBSPOT_API_URL = 'https://api.hubapi.com';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

function getApiKey(): string {
  if (!HUBSPOT_API_KEY) {
    throw new Error('HUBSPOT_API_KEY environment variable is required. Please create a .env.local file with your HubSpot API key.');
  }
  return HUBSPOT_API_KEY;
}

// ============================================================
// Helper Functions
// ============================================================

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getApiKey()}`,
  };
}

async function handleHubSpotError(response: Response, context: string): Promise<never> {
  const error: HubSpotError = await response.json().catch(() => ({
    status: 'UNKNOWN',
    message: 'Failed to parse error response',
  }));

  // eslint-disable-next-line no-console
  console.error(`[HubSpot Error - ${context}]`, error);

  throw new Error(`HubSpot API error (${context}): ${error.message}`);
}

// ============================================================
// CONTACTS
// ============================================================

export class ContactsService {
  /**
   * Find contact by email
   */
  static async findByEmail(email: string): Promise<HubSpotObject | null> {
    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
        limit: 1,
      }),
    });

    if (!response.ok) {
      await handleHubSpotError(response, 'FindByEmail');
    }

    const data: HubSpotPagedResponse = await response.json();
    return data.results?.[0] || null;
  }

  /**
   * Create new contact
   */
  static async create(data: ContactData): Promise<HubSpotObject> {
    const properties: Record<string, string> = {
      email: data.email,
    };

    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.phone) properties.phone = data.phone;
    if (data.rol_en_la_operacion) properties.rol_en_la_operacion = data.rol_en_la_operacion;

    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ properties }),
    });

    if (!response.ok) {
      await handleHubSpotError(response, 'Create');
    }

    return response.json();
  }

  /**
   * Update existing contact
   */
  static async update(contactId: string, data: Partial<ContactData>): Promise<HubSpotObject> {
    const properties: Record<string, string> = {};

    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.phone) properties.phone = data.phone;
    if (data.rol_en_la_operacion) properties.rol_en_la_operacion = data.rol_en_la_operacion;

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'Update');
    }

    return response.json();
  }

  /**
   * Find or create contact (idempotent)
   */
  static async findOrCreate(data: ContactData): Promise<HubSpotObject> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      // eslint-disable-next-line no-console
      console.log('[Contacts] Reusing existing contact:', existing.id);
      return existing;
    }

    // eslint-disable-next-line no-console
    console.log('[Contacts] Creating new contact for:', data.email);
    return this.create(data);
  }

  /**
   * Get contact by ID
   */
  static async getById(id: string): Promise<HubSpotObject | null> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${id}?properties=email,firstname,lastname,phone,rol_en_la_operacion`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      await handleHubSpotError(response, 'GetById (Contacts)');
    }

    return response.json();
  }

  /**
   * Get multiple contacts by IDs in a single batch
   */
  static async batchGetByIds(ids: string[]): Promise<HubSpotObject[]> {
    if (ids.length === 0) return [];
    
    // Remove duplicates and empty IDs
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/batch/read`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          properties: ['email', 'firstname', 'lastname', 'phone'],
          inputs: uniqueIds.map(id => ({ id })),
        }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'BatchGetByIds (Contacts)');
    }

    const data = await response.json();
    return data.results || [];
  }
}

// ============================================================

// ============================================================
// COMPANIES
// ============================================================

export class CompaniesService {
  /**
   * Find company by domain
   */
  static async findByDomain(domain: string): Promise<HubSpotObject | null> {
    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/companies/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'domain',
                operator: 'EQ',
                value: domain,
              },
            ],
          },
        ],
        limit: 1,
      }),
    });

    if (!response.ok) {
      await handleHubSpotError(response, 'FindByDomain');
    }

    const data: HubSpotPagedResponse = await response.json();
    return data.results?.[0] || null;
  }

  /**
   * Create new company
   */
  static async create(data: CompanyData): Promise<HubSpotObject> {
    const properties: Record<string, string> = {
      name: data.name,
    };

    if (data.domain) properties.domain = data.domain;
    if (data.country) properties.country = data.country;
    if (data.industry) properties.industry = data.industry;

    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/companies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ properties }),
    });

    if (!response.ok) {
      await handleHubSpotError(response, 'Create');
    }

    return response.json();
  }

  /**
   * Update existing company
   */
  static async update(companyId: string, data: Partial<CompanyData>): Promise<HubSpotObject> {
    const properties: Record<string, string> = {};

    if (data.name) properties.name = data.name;
    if (data.domain) properties.domain = data.domain;
    if (data.country) properties.country = data.country;
    if (data.industry) properties.industry = data.industry;

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/companies/${companyId}`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'Update');
    }

    return response.json();
  }
}

// ============================================================
// COTIZACIONES (Custom Object 0-3, formerly Deals)
// ============================================================

export class CotizacionesService {
  /**
   * Create new cotizacion
   */
  static async create(data: CotizacionData): Promise<HubSpotObject> {
    const properties: Record<string, string> = {
      // Required fields
      producto_cotizado: data.producto_cotizado,
      incoterm: data.incoterm,
      tipo_cliente_operacion: data.tipo_cliente_operacion,
      
      // Default state
      estado_cotizacion: data.estado_cotizacion || 'levantando_precio',
    };

    // Optional fields
    if (data.mercado_origen) properties.mercado_origen = data.mercado_origen;
    if (data.puerto_salida) properties.puerto_salida = data.puerto_salida;
    if (data.fecha_envio_cotizacion) {
      properties.fecha_envio_cotizacion = data.fecha_envio_cotizacion;
    }

    // Auto-generate deal name if not provided
    if (data.dealName) {
      properties.dealname = data.dealName;
    } else if (data.producto_cotizado === 'otro' && data.producto_nombre_original) {
      // Use original commodity name when enum is 'otro'
      properties.dealname = `${data.producto_nombre_original} — ${data.amount || 'N/A'} MT (${(data.incoterm || '').toUpperCase()})`;
    } else {
      const productLabel = PRODUCTO_LABELS[data.producto_cotizado] || data.producto_cotizado;
      properties.dealname = `${productLabel} — ${data.amount || 'N/A'} MT (${(data.incoterm || '').toUpperCase()})`;
    }

    // MANDATORY: Set pipeline and dealstage for Sales Pipeline visibility
    properties.pipeline = 'default';
    properties.dealstage = 'appointmentscheduled'; // Default initial stage

    // --- Operational Defaults (Phase 4) ---
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const formattedNextWeek = nextWeek.toISOString().split('T')[0];

    properties.tipo_de_proceso = 'cotizacion';
    properties.estado_del_suplidor = 'pendiente_por_contactar';
    properties.fecha_solicitud_a_suplidor = formattedToday;
    properties.fecha_respuesta_del_suplidor = formattedNextWeek;
    properties.estado_de_la_cotizacion = 'solicitud_recibida';
    properties.trial_solicitado = 'false';
    properties.resultado_de_la_cotizacion = 'pendiente';
    // --------------------------------------

    if (data.amount) properties.amount = String(data.amount);
    if (data.description) properties.description = data.description;
    // Note: 'notes' field not stored as hs_description doesn't exist in Cotizaciones object

    const body: Record<string, unknown> = { properties };

    // Add associations if provided
    const associations: Array<{ to: { id: string }; types: Array<{ associationCategory: string; associationTypeId: string }> }> = [];

    if (data.contactId) {
      associations.push({
        to: { id: data.contactId },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: ASSOCIATION_TYPES.CONTACT_TO_DEAL,
          },
        ],
      });
    }

    if (data.companyId) {
      associations.push({
        to: { id: data.companyId },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: ASSOCIATION_TYPES.COMPANY_TO_DEAL,
          },
        ],
      });
    }

    if (associations.length > 0) {
      body.associations = associations;
    }

    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Fallback: try without associations
      if (associations.length > 0) {
        // eslint-disable-next-line no-console
        console.warn('[Cotizaciones] Association failed, retrying without associations...');
        const { associations: _, ...bodyNoAssoc } = body;
        const fallbackRes = await fetch(
          `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}`,
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bodyNoAssoc),
          }
        );

        if (!fallbackRes.ok) {
          await handleHubSpotError(fallbackRes, 'Create (fallback)');
        }

        return fallbackRes.json();
      }

      await handleHubSpotError(response, 'Create');
    }

    return response.json();
  }

  /**
   * Get cotizacion by ID with all necessary properties
   */
  static async getById(id: string): Promise<HubSpotObject | null> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${id}?properties=dealname,estado_cotizacion,fecha_envio_cotizacion,producto_cotizado,incoterm,tipoclienteoperacion,puerto_salida,mercado_origen,amount,description,createdate,pipeline,dealstage,tipo_de_proceso,estado_del_suplidor,fecha_solicitud_a_suplidor,fecha_respuesta_del_suplidor,estado_de_la_cotizacion,trial_solicitado,resultado_de_la_cotizacion,updatedate`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      await handleHubSpotError(response, 'GetById');
    }

    return response.json();
  }

  /**
   * Get associated contact for a cotizacion
   */
  static async getAssociatedContact(cotizacionId: string): Promise<HubSpotObject | null> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${cotizacionId}/associations/contacts`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      await handleHubSpotError(response, 'GetAssociatedContact');
    }

    const data = await response.json();
    const contactId = data.results?.[0]?.id;
    
    if (!contactId) return null;

    return ContactsService.getById(contactId);
  }

  /**
   * Get associated contacts for multiple cotizaciones in a single batch
   * Returns a map of cotizacionId -> Contact properties
   */
  static async batchGetAssociatedContacts(cotizacionIds: string[]): Promise<Record<string, any>> {
    if (cotizacionIds.length === 0) return {};

    // 1. Fetch associations in batch
    const assocResponse = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/associations/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${HUBSPOT_OBJECT_TYPES.CONTACTS}/batch/read`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          inputs: cotizacionIds.map(id => ({ id })),
        }),
      }
    );

    if (!assocResponse.ok) {
      await handleHubSpotError(assocResponse, 'BatchGetAssociations');
    }

    const assocData = await assocResponse.json();
    
    // Map of CotizacionID -> ContactID
    const cotizacionToContactMap: Record<string, string> = {};
    const contactIdsToFetch: string[] = [];

    assocData.results?.forEach((result: any) => {
      const contactId = result.to?.[0]?.id;
      if (contactId) {
        cotizacionToContactMap[result.from.id] = contactId;
        contactIdsToFetch.push(contactId);
      }
    });

    if (contactIdsToFetch.length === 0) return {};

    // 2. Fetch contact details in batch
    const contacts = await ContactsService.batchGetByIds(contactIdsToFetch);
    const contactDetailsMap: Record<string, any> = {};
    
    contacts.forEach(contact => {
      contactDetailsMap[contact.id] = {
        id: contact.id,
        email: contact.properties.email,
        firstname: contact.properties.firstname,
        lastname: contact.properties.lastname,
        phone: contact.properties.phone,
      };
    });

    // 3. Final mapping CotizacionID -> ContactDetails
    const finalMap: Record<string, any> = {};
    Object.entries(cotizacionToContactMap).forEach(([cotId, conId]) => {
      if (contactDetailsMap[conId]) {
        finalMap[cotId] = contactDetailsMap[conId];
      }
    });

    return finalMap;
  }

  /**
   * Update cotizacion properties
   */
  static async update(id: string, data: CotizacionUpdateData): Promise<HubSpotObject> {
    const properties: Record<string, string> = {
      pipeline: 'default',
    };

    if (data.estado_cotizacion) {
      properties.estado_cotizacion = data.estado_cotizacion;
      // Map estado_cotizacion to dealstage for pipeline visibility
      const estadoToDealstageMap: Record<EstadoCotizacion, string> = {
        levantando_precio: 'appointmentscheduled',
        validando_logistica: 'qualifiedtobuy',
        preparando_cotizacion_formal: 'presentationscheduled',
        cotizacion_enviada: 'contractsent',
        en_negociacion: 'decisionmakerboughtin',
        ganada: 'closedwon',
        perdida: 'closedlost',
      };
      properties.dealstage = estadoToDealstageMap[data.estado_cotizacion] || 'appointmentscheduled';
    }
    if (data.fecha_envio_cotizacion) properties.fecha_envio_cotizacion = data.fecha_envio_cotizacion;
    if (data.producto_cotizado) properties.producto_cotizado = data.producto_cotizado;
    if (data.incoterm) properties.incoterm = data.incoterm;
    if (data.tipo_cliente_operacion) properties.tipo_cliente_operacion = data.tipo_cliente_operacion;
    if (data.puerto_salida) properties.puerto_salida = data.puerto_salida;
    if (data.mercado_origen) properties.mercado_origen = data.mercado_origen;
    if (data.amount) properties.amount = String(data.amount);
    if (data.description) properties.description = data.description;
    
    // Operational fields (Phase 4 - Admin Panel)
    if (data.tipodeproceso) properties.tipo_de_proceso = data.tipodeproceso;
    if (data.estadodelsuplidor) properties.estado_del_suplidor = data.estadodelsuplidor;
    if (data.fechasolicituda_suplidor) properties.fecha_solicitud_a_suplidor = data.fechasolicituda_suplidor;
    if (data.fecharespuestadel_suplidor) properties.fecha_respuesta_del_suplidor = data.fecharespuestadel_suplidor;
    if (data.estadodela_cotizacion) properties.estado_de_la_cotizacion = data.estadodela_cotizacion;
    if (data.trial_solicitado !== undefined) properties.trial_solicitado = String(data.trial_solicitado);
    if (data.resultadodela_cotizacion) properties.resultado_de_la_cotizacion = data.resultadodela_cotizacion;

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${id}`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'Update');
    }

    return response.json();
  }

  /**
   * Update only the status (with automatic fecha_envio handling)
   * Maps estado_cotizacion to HubSpot dealstage for pipeline visibility
   */
  static async updateStatus(
    id: string,
    newStatus: EstadoCotizacion,
    options?: { skipAutoDate?: boolean }
  ): Promise<HubSpotObject> {
    // Map our custom estado_cotizacion to HubSpot dealstage values
    const estadoToDealstageMap: Record<EstadoCotizacion, string> = {
      levantando_precio: 'appointmentscheduled',
      validando_logistica: 'qualifiedtobuy',
      preparando_cotizacion_formal: 'presentationscheduled',
      cotizacion_enviada: 'contractsent',
      en_negociacion: 'decisionmakerboughtin',
      ganada: 'closedwon',
      perdida: 'closedlost',
    };

    const properties: Record<string, string> = {
      estado_cotizacion: newStatus,
      dealstage: estadoToDealstageMap[newStatus] || 'appointmentscheduled',
      pipeline: 'default',
    };

    // Auto-set fecha_envio_cotizacion when status changes to 'cotizacion_enviada'
    if (newStatus === 'cotizacion_enviada' && !options?.skipAutoDate) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      properties.fecha_envio_cotizacion = today;
      // eslint-disable-next-line no-console
      console.log('[Cotizaciones] Auto-set fecha_envio_cotizacion:', today);
    }

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${id}`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'UpdateStatus');
    }

    return response.json();
  }

  /**
   * Get cotizaciones by contact email
   */
  static async getByContactEmail(email: string): Promise<HubSpotObject[]> {
    // First find contact
    const contact = await ContactsService.findByEmail(email);
    if (!contact) {
      // eslint-disable-next-line no-console
      console.log('[Cotizaciones] No contact found for email:', email);
      return [];
    }

    // Get associated deals
    const dealsRes = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contact.id}/associations/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}`,
      {
        headers: getHeaders(),
      }
    );

    if (!dealsRes.ok) {
      // eslint-disable-next-line no-console
      console.warn('[Cotizaciones] Failed to fetch associations for contact:', contact.id);
      return [];
    }

    const dealsData: HubSpotPagedResponse = await dealsRes.json();
    const dealIds = dealsData.results?.map((d) => d.id) || [];

    if (dealIds.length === 0) {
      return [];
    }

    // Fetch deal details
    const deals: HubSpotObject[] = [];
    for (const dealId of dealIds.slice(0, 50)) {
      const deal = await this.getById(dealId);
      if (deal) {
        deals.push(deal);
      }
    }

    return deals;
  }

  /**
   * Search cotizaciones by status
   */
  static async searchByStatus(
    status: EstadoCotizacion,
    limit: number = 50
  ): Promise<HubSpotObject[]> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/search`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'estado_cotizacion',
                  operator: 'EQ',
                  value: status,
                },
              ],
            },
          ],
          sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
          limit,
          properties: [
            'dealname',
            'estado_cotizacion',
            'fecha_envio_cotizacion',
            'producto_cotizado',
            'incoterm',
            'tipo_cliente_operacion',
            'puerto_salida',
            'mercado_origen',
            'amount',
            'description',
            'createdate',
          ],
        }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'SearchByStatus');
    }

    const data: HubSpotPagedResponse = await response.json();
    return data.results || [];
  }

  /**
   * List all cotizaciones (with optional filters)
   */
  static async list(options?: {
    limit?: number;
    after?: string;
    sortBy?: string;
    direction?: 'ASCENDING' | 'DESCENDING';
  }): Promise<{ results: HubSpotObject[]; paging?: HubSpotPagedResponse['paging'] }> {
    const params = new URLSearchParams();
    params.set('limit', String(options?.limit || 100));
    if (options?.after) params.set('after', options.after);
    if (options?.sortBy) params.set('sort', `${options.sortBy}:${options.direction || 'DESCENDING'}`);

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}?${params.toString()}&properties=dealname,estado_cotizacion,fecha_envio_cotizacion,producto_cotizado,incoterm,tipoclienteoperacion,puerto_salida,mercado_origen,amount,description,createdate,pipeline,dealstage,tipo_de_proceso,estado_del_suplidor,fecha_solicitud_a_suplidor,fecha_respuesta_del_suplidor,estado_de_la_cotizacion,trial_solicitado,resultado_de_la_cotizacion,updatedate`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'List');
    }

    return response.json();
  }

  /**
   * Search cotizaciones with advanced filters (for Admin Panel)
   * Supports filtering by operational fields
   */
  static async searchWithFilters(options?: {
    query?: string;
    estadodelsuplidor?: EstadoDelSuplidor[];
    estadodela_cotizacion?: EstadoOperativoCotizacion[];
    resultadodela_cotizacion?: ResultadoDeCotizacion[];
    trial_solicitado?: boolean;
    tipodeproceso?: TipoDeProceso[];
    fecha_solicitud_desde?: string;
    fecha_solicitud_hasta?: string;
    fecha_respuesta_desde?: string;
    fecha_respuesta_hasta?: string;
    limit?: number;
    after?: string;
  }): Promise<{ results: HubSpotObject[]; paging?: HubSpotPagedResponse['paging'] }> {
    const filters: Array<{
      propertyName: string;
      operator: string;
      value?: string;
      values?: string[];
    }> = [];

    // Filter by estado del suplidor (multi-select)
    if (options?.estadodelsuplidor && options.estadodelsuplidor.length > 0) {
      filters.push({
        propertyName: 'estado_del_suplidor',
        operator: 'IN',
        values: options.estadodelsuplidor,
      });
    }

    // Filter by estado de cotización operativo (multi-select)
    if (options?.estadodela_cotizacion && options.estadodela_cotizacion.length > 0) {
      filters.push({
        propertyName: 'estado_de_la_cotizacion',
        operator: 'IN',
        values: options.estadodela_cotizacion,
      });
    }

    // Filter by resultado (multi-select)
    if (options?.resultadodela_cotizacion && options.resultadodela_cotizacion.length > 0) {
      filters.push({
        propertyName: 'resultado_de_la_cotizacion',
        operator: 'IN',
        values: options.resultadodela_cotizacion,
      });
    }

    // Filter by trial solicitado (boolean)
    if (options?.trial_solicitado !== undefined) {
      filters.push({
        propertyName: 'trial_solicitado',
        operator: 'EQ',
        value: String(options.trial_solicitado),
      });
    }

    // Filter by tipo de proceso (multi-select)
    if (options?.tipodeproceso && options.tipodeproceso.length > 0) {
      filters.push({
        propertyName: 'tipo_de_proceso',
        operator: 'IN',
        values: options.tipodeproceso,
      });
    }

    // Filter by fecha solicitud (range)
    if (options?.fecha_solicitud_desde) {
      filters.push({
        propertyName: 'fecha_solicitud_a_suplidor',
        operator: 'GTE',
        value: options.fecha_solicitud_desde,
      });
    }
    if (options?.fecha_solicitud_hasta) {
      filters.push({
        propertyName: 'fecha_solicitud_a_suplidor',
        operator: 'LTE',
        value: options.fecha_solicitud_hasta,
      });
    }

    // Filter by fecha respuesta (range)
    if (options?.fecha_respuesta_desde) {
      filters.push({
        propertyName: 'fecha_respuesta_del_suplidor',
        operator: 'GTE',
        value: options.fecha_respuesta_desde,
      });
    }
    if (options?.fecha_respuesta_hasta) {
      filters.push({
        propertyName: 'fecha_respuesta_del_suplidor',
        operator: 'LTE',
        value: options.fecha_respuesta_hasta,
      });
    }

    const body: Record<string, unknown> = {
      filterGroups: filters.length > 0 ? [{ filters }] : [],
      sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
      limit: options?.limit || 100,
      query: options?.query,
      properties: [
        'dealname',
        'estado_cotizacion',
        'fecha_envio_cotizacion',
        'producto_cotizado',
        'incoterm',
        'tipo_cliente_operacion',
        'puerto_salida',
        'mercado_origen',
        'amount',
        'description',
        'dealstage',
        'createdate',
        'updatedate',
        'tipo_de_proceso',
        'estado_del_suplidor',
        'fecha_solicitud_a_suplidor',
        'fecha_respuesta_del_suplidor',
        'estado_de_la_cotizacion',
        'trial_solicitado',
        'resultado_de_la_cotizacion',
      ],
    };

    if (options?.after) {
      body.after = options.after;
    }

    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/search`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'SearchWithFilters');
    }

    return response.json();
  }

  /**
   * Delete (archive) multiple cotizaciones in a single batch
   */
  static async deleteBatch(ids: string[]): Promise<boolean> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/batch/archive`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          inputs: ids.map(id => ({ id })),
        }),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'DeleteBatch');
    }

    return true; // Usually returns 204 No Content
  }
}

// ============================================================
// ACTIVITIES (Notes & Tasks)
// ============================================================

export class ActivitiesService {
  /**
   * Create a note and associate it with a cotizacion
   */
  static async createNote(activity: ActivityNote): Promise<HubSpotObject> {
    // HubSpot notes require hs_timestamp (epoch ms).
    const timestampMs = String(Date.now());
    const note = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        properties: {
          hs_note_body: activity.content,
          hs_timestamp: timestampMs,
        },
      }),
    });

    if (!note.ok) {
      await handleHubSpotError(note, 'CreateNote');
    }

    const noteData: HubSpotObject = await note.json();

    // Associate note with cotizacion
    if (activity.cotizacionId) {
      await this.associateObjects(
        'notes',
        noteData.id,
        HUBSPOT_OBJECT_TYPES.COTIZACIONES,
        activity.cotizacionId,
        ASSOCIATION_TYPES.NOTE_TO_COTIZACION
      );
    }

    return noteData;
  }

  /**
   * Get all notes associated with a cotizacion
   */
  static async getNotesByCotizacionId(cotizacionId: string): Promise<Array<{ body: string; createdAt: string }>> {
    try {
      // 1. Get associated note IDs
      const assocRes = await fetch(
        `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${cotizacionId}/associations/notes`,
        { headers: getHeaders() }
      );

      if (!assocRes.ok) {
        if (assocRes.status === 404) return [];
        await handleHubSpotError(assocRes, 'GetNoteAssociations');
      }

      const assocData = await assocRes.json();
      const noteIds = assocData.results?.map((r: any) => r.id) || [];

      if (noteIds.length === 0) return [];

      // 2. Fetch note details (max 100 for safety)
      const batchRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/notes/batch/read`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          properties: ['hs_note_body', 'hs_timestamp', 'createdate'],
          inputs: noteIds.map((id: string) => ({ id })),
        }),
      });

      if (!batchRes.ok) {
        await handleHubSpotError(batchRes, 'BatchReadNotes');
      }

      const batchData = await batchRes.json();

      // 3. Format and sort by date descending
      return (batchData.results || [])
        .map((n: HubSpotObject) => {
          const props = n.properties || {};
          const ts = props.hs_timestamp || props.createdate || '';
          return {
            body: (props.hs_note_body as string) || '',
            createdAt: String(ts),
          };
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

    } catch (error) {
      console.error('[HubSpot Service] Error fetching notes:', error);
      return [];
    }
  }

  /**
   * Create a task and associate it with a cotizacion
   */
  static async createTask(task: FollowUpTask): Promise<HubSpotObject> {
    const properties: Record<string, string> = {
      hs_task_subject: task.title,
    };

    if (task.description) properties.hs_task_body = task.description;
    if (task.dueDate) properties.hs_timestamp = task.dueDate;

    const taskRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ properties }),
    });

    if (!taskRes.ok) {
      await handleHubSpotError(taskRes, 'CreateTask');
    }

    const taskData: HubSpotObject = await taskRes.json();

    // Associate task with cotizacion
    if (task.cotizacionId) {
      await this.associateObjects(
        'tasks',
        taskData.id,
        HUBSPOT_OBJECT_TYPES.COTIZACIONES,
        task.cotizacionId
      );
    }

    return taskData;
  }

  /**
   * Associate two HubSpot objects
   */
  private static async associateObjects(
    fromObjectType: string,
    fromObjectId: string,
    toObjectType: string,
    toObjectId: string,
    associationTypeId: string = ASSOCIATION_TYPES.CONTACT_TO_DEAL
  ): Promise<void> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}/${associationTypeId}`,
      {
        method: 'PUT',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Activities] Failed to associate ${fromObjectType} with ${toObjectType}`,
        await response.json().catch(() => ({}))
      );
    }
  }
}

// ============================================================
// Export unified service
// ============================================================

export const HubSpotService = {
  contacts: ContactsService,
  companies: CompaniesService,
  cotizaciones: CotizacionesService,
  activities: ActivitiesService,
};
