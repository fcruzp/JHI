// ============================================================
// Cotizaci\u00f3n Validator
// Validates cotizacion data before state transitions and creation
// ============================================================

import {
  CotizacionData,
  CotizacionUpdateData,
  EstadoCotizacion,
  ProductoCotizado,
  Incoterm,
  TipoClienteOperacion,
  ValidationError,
  ValidationException,
} from '../hubspot/types';

// Valid enum values (must match HubSpot schema)
const VALID_PRODUCTOS: ProductoCotizado[] = ['azucar', 'chicken_paws', 'otro'];
const VALID_INCOTERMS: Incoterm[] = ['fob', 'cif', 'cfr', 'exw', 'otro'];
const VALID_TIPOS_CLIENTE: TipoClienteOperacion[] = ['cliente_directo', 'otro_broker'];
const VALID_ESTADOS: EstadoCotizacion[] = [
  'levantando_precio',
  'validando_logistica',
  'preparando_cotizacion_formal',
  'cotizacion_enviada',
  'en_negociacion',
  'ganada',
  'perdida',
];

export class CotizacionValidator {
  /**
   * Validate cotizacion creation data
   */
  static validateCreateData(data: CotizacionData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.producto_cotizado) {
      errors.push({
        field: 'producto_cotizado',
        message: 'Producto cotizado is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (!VALID_PRODUCTOS.includes(data.producto_cotizado)) {
      errors.push({
        field: 'producto_cotizado',
        message: `Invalid producto cotizado. Must be one of: ${VALID_PRODUCTOS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    if (!data.incoterm) {
      errors.push({
        field: 'incoterm',
        message: 'Incoterm is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (!VALID_INCOTERMS.includes(data.incoterm)) {
      errors.push({
        field: 'incoterm',
        message: `Invalid incoterm. Must be one of: ${VALID_INCOTERMS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    if (!data.tipo_cliente_operacion) {
      errors.push({
        field: 'tipo_cliente_operacion',
        message: 'Tipo cliente operacion is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (!VALID_TIPOS_CLIENTE.includes(data.tipo_cliente_operacion)) {
      errors.push({
        field: 'tipo_cliente_operacion',
        message: `Invalid tipo cliente operacion. Must be one of: ${VALID_TIPOS_CLIENTE.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    // Validate estado if provided
    if (data.estado_cotizacion && !VALID_ESTADOS.includes(data.estado_cotizacion)) {
      errors.push({
        field: 'estado_cotizacion',
        message: `Invalid estado cotizacion. Must be one of: ${VALID_ESTADOS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    // Validate email or contactId exists
    if (!data.contactEmail && !data.contactId) {
      errors.push({
        field: 'contactEmail',
        message: 'Either contactEmail or contactId is required',
        code: 'REQUIRED_FIELD',
      });
    }

    if (data.contactEmail && !this.isValidEmail(data.contactEmail)) {
      errors.push({
        field: 'contactEmail',
        message: 'Invalid email format',
        code: 'INVALID_FORMAT',
      });
    }

    return errors;
  }

  /**
   * Validate cotizacion update data
   */
  static validateUpdateData(data: CotizacionUpdateData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (data.producto_cotizado && !VALID_PRODUCTOS.includes(data.producto_cotizado)) {
      errors.push({
        field: 'producto_cotizado',
        message: `Invalid producto cotizado. Must be one of: ${VALID_PRODUCTOS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    if (data.incoterm && !VALID_INCOTERMS.includes(data.incoterm)) {
      errors.push({
        field: 'incoterm',
        message: `Invalid incoterm. Must be one of: ${VALID_INCOTERMS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    if (data.tipo_cliente_operacion && !VALID_TIPOS_CLIENTE.includes(data.tipo_cliente_operacion)) {
      errors.push({
        field: 'tipo_cliente_operacion',
        message: `Invalid tipo cliente operacion. Must be one of: ${VALID_TIPOS_CLIENTE.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    if (data.estado_cotizacion && !VALID_ESTADOS.includes(data.estado_cotizacion)) {
      errors.push({
        field: 'estado_cotizacion',
        message: `Invalid estado cotizacion. Must be one of: ${VALID_ESTADOS.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }

    // Validate date format if provided
    if (data.fecha_envio_cotizacion && !this.isValidDateFormat(data.fecha_envio_cotizacion)) {
      errors.push({
        field: 'fecha_envio_cotizacion',
        message: 'Invalid date format. Must be YYYY-MM-DD',
        code: 'INVALID_FORMAT',
      });
    }

    return errors;
  }

  /**
   * Validate required fields for a specific state
   */
  static validateStateRequirements(
    estado: EstadoCotizacion,
    data: Record<string, unknown>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // State-specific required fields
    const requiredFieldsByState: Record<EstadoCotizacion, string[]> = {
      levantando_precio: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion'],
      validando_logistica: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion', 'mercado_origen', 'puerto_salida'],
      preparando_cotizacion_formal: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion', 'mercado_origen', 'puerto_salida'],
      cotizacion_enviada: ['producto_cotizado', 'incoterm', 'tipo_cliente_operacion', 'mercado_origen', 'puerto_salida', 'contactEmail'],
      en_negociacion: [],
      ganada: [],
      perdida: [],
    };

    const requiredFields = requiredFieldsByState[estado] || [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push({
          field,
          message: `${field} is required for state "${estado}"`,
          code: 'STATE_REQUIREMENT',
        });
      }
    }

    return errors;
  }

  /**
   * Throw exception if validation fails
   */
  static assertValid(errors: ValidationError[], _context: string = 'Validation'): void {
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }

  /**
   * Quick validation helper - throws if invalid
   */
  static validateAndThrow(data: CotizacionData): void {
    const errors = this.validateCreateData(data);
    this.assertValid(errors, 'Create Cotizacion');
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  private static isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }
}
