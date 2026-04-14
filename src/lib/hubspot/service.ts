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
} from './types';

const HUBSPOT_API_URL = 'https://api.hubapi.com';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

if (!HUBSPOT_API_KEY) {
  throw new Error('HUBSPOT_API_KEY environment variable is required');
}

// ============================================================
// Helper Functions
// ============================================================

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
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
}

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
      properties.dealname = `${data.producto_nombre_original} — ${data.amount || 'N/A'} MT (${data.incoterm})`;
    } else {
      properties.dealname = `${data.producto_cotizado} — ${data.amount || 'N/A'} MT (${data.incoterm})`;
    }

    // MANDATORY: Set pipeline and dealstage for Sales Pipeline visibility
    properties.pipeline = 'default';
    properties.dealstage = 'appointmentscheduled'; // Default initial stage

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
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}/${id}?properties=dealname,estado_cotizacion,fecha_envio_cotizacion,producto_cotizado,incoterm,tipoclienteoperacion,puerto_salida,mercado_origen,amount,description,createdate,pipeline,dealstage`,
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
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${HUBSPOT_OBJECT_TYPES.COTIZACIONES}?limit=${options?.limit || 100}${
        options?.after ? `&after=${options.after}` : ''
      }`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      await handleHubSpotError(response, 'List');
    }

    return response.json();
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
    const note = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        properties: {
          hs_note_body: activity.content,
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
        '0-12', // Notes object type
        noteData.id,
        HUBSPOT_OBJECT_TYPES.COTIZACIONES,
        activity.cotizacionId
      );
    }

    return noteData;
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
        '0-7', // Tasks object type
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
    toObjectId: string
  ): Promise<void> {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}/${ASSOCIATION_TYPES.CONTACT_TO_DEAL}`,
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
