// ============================================================
// Email Service - Using Resend (Free tier: 3,000 emails/month)
// ============================================================

import { Resend } from 'resend';
import React from 'react';
import { CotizacionEnviadaEmail } from './templates/cotizacion-enviada';
import { GanadaEmail } from './templates/ganada';
import { PerdidaEmail } from './templates/perdida';
import { InternalNotificationEmail } from './templates/internal-notification';
import { LevantandoPrecioEmail } from './templates/levantando-precio';
import { StatusUpdateEmail } from './templates/status-update';
import { ClientCommentInternalEmail } from './templates/client-comment-internal';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@jhugeint.com';

// Initialize Resend (will work without API key in dev mode with mock)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!RESEND_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[Email Service] RESEND_API_KEY not set. Emails will be logged but not sent.');
}

// ============================================================
// Email Templates Registry
// ============================================================

type EmailTemplateName =
  | 'cotizacion_enviada'
  | 'ganada'
  | 'perdida'
  | 'levantando_precio'
  | 'internal_notification'
  | 'status_update'
  | 'client_comment_internal'
  | 'skay_trigger';

interface EmailTemplateData {
  levantando_precio: {
    nombre: string;
    producto: string;
    incoterm: string;
    cantidad?: string;
    cotizacionId?: string;
  };
  cotizacion_enviada: {
    nombre: string;
    producto: string;
    incoterm: string;
    cotizacionId?: string;
  };
  ganada: {
    nombre: string;
    producto: string;
    incoterm: string;
    cotizacionId?: string;
    nextSteps?: string;
  };
  perdida: {
    nombre: string;
    producto: string;
    cotizacionId?: string;
    reason?: string;
  };
  internal_notification: {
    cotizacionId: string;
    estado: string;
    ownerEmail: string;
    details?: string;
  };
  status_update: {
    nombre: string;
    producto: string;
    incoterm: string;
    estado: string;
    comentario: string;
    cotizacionId?: string;
    cantidad?: string;
  };
  client_comment_internal: {
    customerEmail?: string;
    customerName?: string;
    reference?: string;
    comment: string;
    summary?: string;
  };
  skay_trigger: {
    dealId: string;
    clientName: string;
    clientEmail: string;
    applicantRole: string;
    commodity: string;
    volumeMt: string;
    incoterm: string;
    targetPrice?: string;
    attachmentsStatus?: string;
  };
}

// ============================================================
// Email Service
// ============================================================

export class EmailService {
  static readonly ADMIN_INTERNAL_EMAIL = 'fcruzp@gmail.com';
  /**
   * Send email to client when quote is first created (levantando_precio)
   */
  static async sendLevantandoPrecio(
    to: string,
    data: { nombre: string; producto: string; incoterm: string; cantidad?: string; cotizacionId?: string }
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('levantando_precio', to, data);
  }

  /**
   * Send email to client when cotizacion is sent
   */
  static async sendCotizacionEnviada(
    to: string,
    data: EmailTemplateData['cotizacion_enviada']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('cotizacion_enviada', to, data);
  }

  /**
   * Send email to client when cotizacion is won
   */
  static async sendGanada(
    to: string,
    data: EmailTemplateData['ganada']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('ganada', to, data);
  }

  /**
   * Send email to client when cotizacion is lost (optional)
   */
  static async sendPerdida(
    to: string,
    data: EmailTemplateData['perdida']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('perdida', to, data);
  }

  /**
   * Send internal notification to owner
   */
  static async sendInternalNotification(
    to: string,
    data: EmailTemplateData['internal_notification']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('internal_notification', to, data);
  }

  /**
   * Send manual status update with custom comment
   */
  static async sendStatusUpdate(
    to: string,
    data: EmailTemplateData['status_update']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('status_update', to, data);
  }

  /**
   * Send internal email to admin team with customer's comment (from chat)
   */
  static async sendClientCommentInternal(
    data: EmailTemplateData['client_comment_internal']
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendTemplate('client_comment_internal', this.ADMIN_INTERNAL_EMAIL, data);
  }

  /**
   * Send plain-text trigger email to Virtual CEO (Skay Huge)
   */
  static async sendSkayTrigger(
    data: EmailTemplateData['skay_trigger']
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const subject = `[SYSTEM TRIGGER] New Lead - Deal ID: ${data.dealId}`;
      const to = 'skay.huge@jhugeint.com';
      
      const textBody = `SYSTEM NOTIFICATION: NEW JHUGE PORTAL REQUEST

[HUBSPOT_DEAL_ID]: ${data.dealId}
[CLIENT_NAME]: ${data.clientName}
[CLIENT_EMAIL]: ${data.clientEmail}
[APPLICANT_ROLE]: ${data.applicantRole}
[COMMODITY]: ${data.commodity}
[VOLUME_MT]: ${data.volumeMt}
[INCOTERM]: ${data.incoterm}
[TARGET_PRICE]: ${data.targetPrice || 'N/A'}

[ATTACHMENTS_STATUS]: ${data.attachmentsStatus || 'No documents uploaded yet.'}`;

      if (!resend) {
        console.log(`[Email Mock] Would send SKAY TRIGGER to ${to}:`, { subject, text: textBody });
        return { success: true };
      }

      const { data: emailData, error } = await resend.emails.send({
        from: `J Huge International <${EMAIL_FROM}>`,
        to,
        subject,
        text: textBody,
      });

      if (error) {
        console.error('[Email Service] Failed to send Skay Trigger:', error);
        return { success: false };
      }

      console.log('[Email Service] Skay Trigger sent successfully to', to, '- ID:', emailData?.id);
      return { success: true, messageId: emailData?.id };
    } catch (error) {
      console.error('[Email Service] Error sending Skay Trigger:', error);
      return { success: false };
    }
  }

  /**
   * Send email based on template name (public for state machine use)
   */
  static async sendTemplate<T extends EmailTemplateName>(
    template: T,
    to: string,
    data: EmailTemplateData[T]
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      // If no Resend API key, just log
      if (!resend) {
        // eslint-disable-next-line no-console
        console.log(`[Email Mock] Would send email to ${to}:`, {
          template,
          subject: this.getSubject(template, data),
          data,
        });
        return { success: true };
      }

      // Render React email component
      let reactComponent: React.ReactElement;
      let subject: string;

      switch (template) {
        case 'levantando_precio':
          subject = `Solicitud recibida – ${(data as EmailTemplateData['levantando_precio']).producto}`;
          reactComponent = LevantandoPrecioEmail(data as EmailTemplateData['levantando_precio']);
          break;
        case 'cotizacion_enviada':
          subject = `Cotización formal – ${(data as EmailTemplateData['cotizacion_enviada']).producto} – ${(data as EmailTemplateData['cotizacion_enviada']).incoterm}`;
          reactComponent = CotizacionEnviadaEmail(data as EmailTemplateData['cotizacion_enviada']);
          break;
        case 'ganada':
          subject = `Cotización aceptada – ${(data as EmailTemplateData['ganada']).producto} – ${(data as EmailTemplateData['ganada']).incoterm}`;
          reactComponent = GanadaEmail(data as EmailTemplateData['ganada']);
          break;
        case 'perdida':
          subject = `Actualización de cotización – ${(data as EmailTemplateData['perdida']).producto}`;
          reactComponent = PerdidaEmail(data as EmailTemplateData['perdida']);
          break;
        case 'internal_notification':
          subject = `[Acción requerida] Cotización ${(data as EmailTemplateData['internal_notification']).cotizacionId} – ${(data as EmailTemplateData['internal_notification']).estado}`;
          reactComponent = InternalNotificationEmail(data as EmailTemplateData['internal_notification']);
          break;
        case 'status_update':
          subject = `Actualización: ${(data as EmailTemplateData['status_update']).producto} – JHI`;
          reactComponent = StatusUpdateEmail(data as EmailTemplateData['status_update']);
          break;
        case 'client_comment_internal': {
          const d = data as EmailTemplateData['client_comment_internal'];
          const ref = d.reference ? ` – Ref. ${d.reference}` : '';
          subject = `[Chat Cliente] Comentario${ref} – JHI`;
          reactComponent = ClientCommentInternalEmail(d);
          break;
        }
        default:
          throw new Error(`Unknown email template: ${template}`);
      }

      // Send via Resend
      const { data: emailData, error } = await resend.emails.send({
        from: `J Huge International <${EMAIL_FROM}>`,
        to,
        subject,
        react: reactComponent,
      });

      if (error) {
        // eslint-disable-next-line no-console
        console.error('[Email Service] Failed to send email:', error);
        return { success: false };
      }

      // eslint-disable-next-line no-console
      console.log('[Email Service] Email sent successfully to', to, '- ID:', emailData?.id);
      return { success: true, messageId: emailData?.id };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Email Service] Error sending email:', error);
      return { success: false };
    }
  }

  /**
   * Get email subject for template
   */
  private static getSubject<T extends EmailTemplateName>(
    template: T,
    data: EmailTemplateData[T]
  ): string {
    switch (template) {
      case 'levantando_precio':
        return `Solicitud recibida – ${(data as EmailTemplateData['levantando_precio']).producto}`;
      case 'cotizacion_enviada':
        return `Cotización formal – ${(data as EmailTemplateData['cotizacion_enviada']).producto} – ${(data as EmailTemplateData['cotizacion_enviada']).incoterm}`;
      case 'ganada':
        return `Cotización aceptada – ${(data as EmailTemplateData['ganada']).producto} – ${(data as EmailTemplateData['ganada']).incoterm}`;
      case 'perdida':
        return `Actualización de cotización – ${(data as EmailTemplateData['perdida']).producto}`;
      case 'internal_notification':
        return `[Acción requerida] Cotización ${(data as EmailTemplateData['internal_notification']).cotizacionId} – ${(data as EmailTemplateData['internal_notification']).estado}`;
      case 'status_update':
        return `Actualización: ${(data as EmailTemplateData['status_update']).producto} – JHI`;
      case 'client_comment_internal': {
        const d = data as EmailTemplateData['client_comment_internal'];
        const ref = d.reference ? ` – Ref. ${d.reference}` : '';
        return `[Chat Cliente] Comentario${ref} – JHI`;
      }
      default:
        return 'Notificación de J Huge International';
    }
  }

  /**
   * Batch send emails (useful for queue processing)
   */
  static async batchSend(
    emails: Array<{
      template: EmailTemplateName;
      to: string;
      data: EmailTemplateData[EmailTemplateName];
    }>
  ): Promise<{ total: number; success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendTemplate(email.template, email.to, email.data);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { total: emails.length, success, failed };
  }
}

// Export for use in state machine
export type { EmailTemplateName, EmailTemplateData };
