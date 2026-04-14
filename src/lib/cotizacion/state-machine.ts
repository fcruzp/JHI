// ============================================================
// Cotización State Machine
// Manages state transitions, validations, and business rules
// ============================================================

import {
  EstadoCotizacion,
  TransitionResult,
  ValidationError,
  ESTADO_LABELS,
} from '../hubspot/types';
import { HubSpotService } from '../hubspot/service';
import { EmailService } from '../email/service';
import type { EmailTemplateName } from '../email/service';

// ============================================================
// State Transition Map
// Defines which transitions are allowed
// ============================================================

const VALID_TRANSITIONS: Record<EstadoCotizacion, EstadoCotizacion[]> = {
  levantando_precio: ['validando_logistica', 'perdida'],
  validando_logistica: ['preparando_cotizacion_formal', 'perdida'],
  preparando_cotizacion_formal: ['cotizacion_enviada', 'en_negociacion', 'perdida'],
  cotizacion_enviada: ['en_negociacion', 'ganada', 'perdida'],
  en_negociacion: ['cotizacion_enviada', 'ganada', 'perdida'],
  ganada: [], // Terminal state
  perdida: [], // Terminal state
};

// ============================================================
// Business Rules Configuration
// ============================================================

interface StateBusinessRules {
  requiredFields?: string[];
  onEnter?: (context: TransitionContext) => Promise<void>;
  onExit?: (context: TransitionContext) => Promise<void>;
  validations?: Array<{
    check: (context: TransitionContext) => boolean;
    message: string;
    field?: string;
  }>;
  autoActions?: {
    createTask?: {
      title: string;
      description?: string;
      dueDateOffset?: number; // hours from now
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    sendEmail?: {
      toClient?: boolean;
      toInternal?: boolean;
      template?: string;
    };
    createNote?: boolean;
  };
}

export interface TransitionContext {
  cotizacionId: string;
  previousState: EstadoCotizacion;
  newState: EstadoCotizacion;
  userId?: string;
  userReason?: string;
  metadata?: Record<string, unknown>;
  cotizacionData?: Record<string, unknown>;
}

const BUSINESS_RULES: Record<EstadoCotizacion, StateBusinessRules> = {
  // State 1: Levantando Precio
  levantando_precio: {
    requiredFields: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion'],
    
    validations: [
      {
        check: (ctx) => !!ctx.cotizacionData?.producto_cotizado,
        message: 'Producto cotizado es requerido',
        field: 'producto_cotizado',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.incoterm,
        message: 'Incoterm es requerido',
        field: 'incoterm',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.tipo_cliente_operacion,
        message: 'Tipo de cliente en la operación es requerido',
        field: 'tipo_cliente_operacion',
      },
    ],

    autoActions: {
      createTask: [
        {
          title: 'Conseguir precio base',
          description: 'Buscar y validar precio base para la cotización',
          dueDateOffset: 24, // within 24 hours
          priority: 'HIGH',
        },
      ],
      sendEmail: {
        toClient: false, // Optional, only if confirmed
        toInternal: true,
      },
      createNote: true,
    },
  },

  // State 2: Validando Logística
  validando_logistica: {
    validations: [
      {
        check: (ctx) => !!ctx.cotizacionData?.mercado_origen,
        message: 'Mercado de origen debe estar definido antes de validar logística',
        field: 'mercado_origen',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.puerto_salida,
        message: 'Puerto de salida debe estar definido',
        field: 'puerto_salida',
      },
    ],

    autoActions: {
      createTask: [
        {
          title: 'Validar logística completa',
          description: 'Validar puerto, disponibilidad, tiempos y restricciones logísticas',
          dueDateOffset: 24,
          priority: 'HIGH',
        },
      ],
      sendEmail: {
        toClient: false, // Optional visibility email
        toInternal: true,
      },
      createNote: true,
    },
  },

  // State 3: Preparando Cotización Formal
  preparando_cotizacion_formal: {
    requiredFields: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion', 'mercado_origen', 'puerto_salida'],
    
    validations: [
      {
        check: (ctx) => !!ctx.cotizacionData?.producto_cotizado,
        message: 'Producto cotizado es requerido',
        field: 'producto_cotizado',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.incoterm,
        message: 'Incoterm es requerido',
        field: 'incoterm',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.mercado_origen,
        message: 'Mercado de origen es requerido',
        field: 'mercado_origen',
      },
      {
        check: (ctx) => !!ctx.cotizacionData?.puerto_salida,
        message: 'Puerto de salida es requerido',
        field: 'puerto_salida',
      },
    ],

    autoActions: {
      createTask: [
        {
          title: 'Emitir cotización formal',
          description: 'Generar documento formal de cotización',
          dueDateOffset: 24,
          priority: 'HIGH',
        },
      ],
      sendEmail: {
        toClient: false,
        toInternal: false,
      },
      createNote: true,
    },
  },

  // State 4: Cotización Enviada ⭐ CRITICAL
  cotizacion_enviada: {
    validations: [
      {
        check: (ctx) => !!ctx.cotizacionData?.contactEmail || !!ctx.cotizacionData?.contactId,
        message: 'Debe existir un contacto asociado antes de enviar la cotización',
        field: 'contactEmail',
      },
    ],

    autoActions: {
      createTask: [
        {
          title: 'Follow-up: Verificar respuesta del cliente',
          description: 'Contactar al cliente para verificar recepción y resolver dudas',
          dueDateOffset: 48, // 48 hours
          priority: 'HIGH',
        },
      ],
      sendEmail: {
        toClient: true, // AUTOMATIC EMAIL TO CLIENT
        toInternal: true,
        template: 'cotizacion_enviada',
      },
      createNote: true,
    },
  },

  // State 5: En Negociación
  en_negociacion: {
    autoActions: {
      createTask: [
        {
          title: 'Registrar ajustes en negociación',
          description: 'Documentar cambios discutidos con el cliente',
          dueDateOffset: 24,
          priority: 'MEDIUM',
        },
      ],
      sendEmail: {
        toClient: false, // No automatic email, manual follow-up
        toInternal: true,
      },
      createNote: true,
    },
  },

  // State 6: Ganada
  ganada: {
    autoActions: {
      sendEmail: {
        toClient: true,
        toInternal: true,
        template: 'ganada',
      },
      createNote: true,
    },
  },

  // State 7: Perdida
  perdida: {
    autoActions: {
      sendEmail: {
        toClient: false, // Optional thank you email
        toInternal: true,
        template: 'perdida',
      },
      createNote: true,
    },
  },
};

// ============================================================
// State Machine Engine
// ============================================================

export class CotizacionStateMachine {
  /**
   * Execute a state transition with validations and auto-actions
   */
  static async transition(
    cotizacionId: string,
    newState: EstadoCotizacion,
    context: {
      userId?: string;
      userReason?: string;
      metadata?: Record<string, unknown>;
      skipAutoActions?: boolean;
      cotizacionData?: Record<string, unknown>;
    } = {}
  ): Promise<TransitionResult> {
    // 1. Get current cotizacion
    const cotizacion = await HubSpotService.cotizaciones.getById(cotizacionId);
    if (!cotizacion) {
      throw new Error(`Cotización ${cotizacionId} not found`);
    }

    const previousState = cotizacion.properties.estado_cotizacion as EstadoCotizacion;
    
    if (!previousState) {
      throw new Error(`Cotización ${cotizacionId} has no estado_cotizacion set`);
    }

    // 2. Validate transition is allowed
    const allowedTransitions = VALID_TRANSITIONS[previousState];
    if (!allowedTransitions.includes(newState)) {
      throw new Error(
        `Invalid transition from "${previousState}" to "${newState}". Allowed: ${allowedTransitions.join(', ') || 'none (terminal state)'}`
      );
    }

    // 3. No-op if same state
    if (previousState === newState) {
      return {
        success: true,
        previousState,
        newState,
        warnings: ['State unchanged, no transition needed'],
      };
    }

    // 4. Run validations
    const rules = BUSINESS_RULES[newState];
    const validationErrors: ValidationError[] = [];

    if (rules.validations) {
      for (const validation of rules.validations) {
        if (!validation.check({ cotizacionId, previousState, newState, ...context })) {
          validationErrors.push({
            field: validation.field || 'unknown',
            message: validation.message,
          });
        }
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        previousState,
        newState,
        errors: validationErrors.map(e => e.message),
      };
    }

    // 5. Execute state change in HubSpot
    try {
      await HubSpotService.cotizaciones.updateStatus(cotizacionId, newState);
      // eslint-disable-next-line no-console
      console.log(
        `[State Machine] Transitioned ${cotizacionId}: ${previousState} → ${newState}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[State Machine] Failed to update state in HubSpot:', error);
      throw error;
    }

    // 6. Execute auto-actions (unless skipped)
    const actions: TransitionResult['actions'] = {};

    if (!context.skipAutoActions && rules.autoActions) {
      // Create note
      if (rules.autoActions.createNote) {
        try {
          const noteContent = [
            `Estado cambiado: ${ESTADO_LABELS[previousState]} → ${ESTADO_LABELS[newState]}`,
            context.userReason ? `Motivo: ${context.userReason}` : '',
            context.userId ? `Usuario: ${context.userId}` : 'Sistema automático',
            `Fecha: ${new Date().toISOString()}`,
          ].filter(Boolean).join('\n');

          await HubSpotService.activities.createNote({
            content: noteContent,
            cotizacionId,
            userId: context.userId,
          });
          actions.noteCreated = true;
        } catch (_error) {
          // Silently fail - note creation is not critical
        }
      }

      // Create tasks
      if (rules.autoActions.createTask && rules.autoActions.createTask.length > 0) {
        try {
          for (const taskDef of rules.autoActions.createTask) {
            const dueDate = new Date();
            dueDate.setHours(dueDate.getHours() + (taskDef.dueDateOffset || 24));

            await HubSpotService.activities.createTask({
              title: `[${ESTADO_LABELS[newState]}] ${taskDef.title}`,
              description: taskDef.description,
              dueDate: dueDate.toISOString().split('T')[0],
              cotizacionId,
            });
          }
          actions.taskCreated = true;
        } catch (_error) {
          // Silently fail - task creation is not critical
        }
      }

      // Send emails
      if (rules.autoActions.sendEmail) {
        try {
          const cotizacionData = context.cotizacionData || {};
          const clientEmail = cotizacionData.contactEmail as string | undefined;
          const clientName = (cotizacionData.contactName as string) || 'Estimado cliente';

          // Email to client
          if (rules.autoActions.sendEmail.toClient && clientEmail) {
            const template = rules.autoActions.sendEmail.template;
            if (template) {
              await EmailService.sendTemplate(
                template as EmailTemplateName,
                clientEmail,
                {
                  nombre: clientName,
                  producto: (cotizacionData.producto_cotizado as string) || 'producto',
                  incoterm: (cotizacionData.incoterm as string) || 'incoterm',
                  cotizacionId: cotizacionId,
                }
              );
              actions.emailSent = true;
            }
          }

          // Email to internal owner
          if (rules.autoActions.sendEmail.toInternal) {
            const ownerEmail = cotizacionData.ownerEmail as string;
            if (ownerEmail) {
              await EmailService.sendInternalNotification(ownerEmail, {
                cotizacionId,
                estado: ESTADO_LABELS[newState],
                ownerEmail,
                details: context.userReason,
              });
            }
          }
        } catch (_error) {
          actions.emailSent = false;
        }
      }
    }

    return {
      success: true,
      previousState,
      newState,
      actions,
    };
  }

  /**
   * Validate if a transition is possible without executing it
   */
  static async canTransition(
    cotizacionId: string,
    newState: EstadoCotizacion,
    context: Partial<TransitionContext> = {}
  ): Promise<{ can: boolean; errors?: string[] }> {
    try {
      const cotizacion = await HubSpotService.cotizaciones.getById(cotizacionId);
      if (!cotizacion) {
        return { can: false, errors: ['Cotización not found'] };
      }

      const previousState = cotizacion.properties.estado_cotizacion as EstadoCotizacion;
      if (!previousState) {
        return { can: false, errors: ['Cotización has no state set'] };
      }

      const allowedTransitions = VALID_TRANSITIONS[previousState];
      if (!allowedTransitions.includes(newState)) {
        return {
          can: false,
          errors: [`Invalid transition from "${previousState}" to "${newState}"`],
        };
      }

      // Run validations
      const rules = BUSINESS_RULES[newState];
      const errors: string[] = [];

      if (rules.validations) {
        for (const validation of rules.validations) {
          if (!validation.check({ cotizacionId, previousState, newState, ...context })) {
            errors.push(validation.message);
          }
        }
      }

      return { can: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
      return {
        can: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get allowed transitions for a given state
   */
  static getAllowedTransitions(fromState: EstadoCotizacion): EstadoCotizacion[] {
    return VALID_TRANSITIONS[fromState] || [];
  }

  /**
   * Get business rules for a state
   */
  static getBusinessRules(state: EstadoCotizacion): StateBusinessRules {
    return BUSINESS_RULES[state];
  }

  /**
   * Format state for display
   */
  static formatState(state: EstadoCotizacion): string {
    return ESTADO_LABELS[state] || state;
  }

  /**
   * Get state progress percentage (for UI progress bars)
   */
  static getStateProgress(state: EstadoCotizacion): number {
    const progressMap: Record<EstadoCotizacion, number> = {
      levantando_precio: 10,
      validando_logistica: 25,
      preparando_cotizacion_formal: 40,
      cotizacion_enviada: 60,
      en_negociacion: 75,
      ganada: 100,
      perdida: 100,
    };
    return progressMap[state] || 0;
  }
}

// Export transition context type
// Already exported via interface declaration
