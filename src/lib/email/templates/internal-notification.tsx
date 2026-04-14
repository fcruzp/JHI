import { Html, Head, Body, Container, Section, Text, Heading, Hr } from '@react-email/components';

interface InternalNotificationEmailProps {
  cotizacionId: string;
  estado: string;
  ownerEmail: string;
  details?: string;
}

export const InternalNotificationEmail = ({ cotizacionId, estado, ownerEmail, details }: InternalNotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <Container style={{ backgroundColor: '#fff', maxWidth: 600, margin: '40px auto', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Section style={{ backgroundColor: '#1a1a1a', padding: '30px 40px', textAlign: 'center' }}>
          <Heading style={{ color: '#c9a84c', fontSize: 28, margin: 0 }}>JHI - Notificación Interna</Heading>
        </Section>
        <Section style={{ padding: '40px' }}>
          <Heading style={{ color: '#f59e0b', fontSize: 24, margin: '0 0 24px' }}>Acción Requerida</Heading>
          <Text style={{ fontSize: 16, color: '#333', margin: '0 0 16px' }}>
            <strong>Cotización ID:</strong> {cotizacionId}
          </Text>
          <Text style={{ fontSize: 16, color: '#333', margin: '0 0 16px' }}>
            <strong>Nuevo Estado:</strong> {estado}
          </Text>
          {details && (
            <Section style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, padding: 20, margin: '24px 0' }}>
              <Text style={{ fontSize: 14, color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>{details}</Text>
            </Section>
          )}
          <Text style={{ fontSize: 16, color: '#333', margin: '32px 0 0', lineHeight: '24px' }}>
            Este es un mensaje automático del sistema de gestión de cotizaciones.
          </Text>
        </Section>
        <Hr style={{ borderColor: '#e0e0e0', margin: '0 40px' }} />
        <Section style={{ padding: '20px 40px', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999' }}>Sistema Interno JHI</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
