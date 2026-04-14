import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';

interface GanadaEmailProps {
  nombre: string;
  producto: string;
  incoterm: string;
  cotizacionId?: string;
  nextSteps?: string;
}

export const GanadaEmail = ({ nombre, producto, incoterm, cotizacionId, nextSteps }: GanadaEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <Container style={{ backgroundColor: '#fff', maxWidth: 600, margin: '40px auto', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Section style={{ backgroundColor: '#1a1a1a', padding: '30px 40px', textAlign: 'center' }}>
          <Heading style={{ color: '#c9a84c', fontSize: 28, margin: 0 }}>J Huge International</Heading>
          <Text style={{ color: '#fff', fontSize: 14, margin: '8px 0 0', opacity: 0.8 }}>Commodity Trading Since 2008</Text>
        </Section>
        <Section style={{ padding: '40px' }}>
          <Heading style={{ color: '#22c55e', fontSize: 24, margin: '0 0 24px' }}>¡Cotización Aceptada!</Heading>
          <Text style={{ fontSize: 16, color: '#333', margin: '0 0 16px' }}>Estimado/a {nombre},</Text>
          <Text style={{ fontSize: 16, lineHeight: '24px', color: '#333', margin: '0 0 16px' }}>
            Nos complace informarle que su cotización ha sido aceptada exitosamente.
          </Text>
          <Section style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, padding: 20, margin: '24px 0' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#166534', margin: '0 0 16px' }}>Detalles</Text>
            <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Producto:</strong> {producto}</Text>
            <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Incoterm:</strong> {incoterm.toUpperCase()}</Text>
            {cotizacionId && <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Referencia:</strong> {cotizacionId}</Text>}
          </Section>
          {nextSteps && (
            <Text style={{ fontSize: 16, lineHeight: '24px', color: '#333', margin: '0 0 16px' }}>
              <strong>Próximos pasos:</strong><br />{nextSteps}
            </Text>
          )}
          <Text style={{ fontSize: 16, color: '#333', margin: '32px 0 0', lineHeight: '24px' }}>
            Saludos cordiales,<br /><strong>Equipo JHI</strong><br />J Huge International
          </Text>
        </Section>
        <Hr style={{ borderColor: '#e0e0e0', margin: '0 40px' }} />
        <Section style={{ padding: '20px 40px', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999', margin: '8px 0' }}>
            <Link href="https://jhugeinternational.com" style={{ color: '#c9a84c', textDecoration: 'underline' }}>www.jhugeinternational.com</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
