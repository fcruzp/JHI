import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';

interface LevantandoPrecioEmailProps {
  nombre: string;
  producto: string;
  incoterm: string;
  cantidad?: string;
  cotizacionId?: string;
  mensaje?: string; // Customer's original message
}

export const LevantandoPrecioEmail = ({ nombre, producto, incoterm, cantidad, cotizacionId, mensaje }: LevantandoPrecioEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <Container style={{ backgroundColor: '#fff', maxWidth: 600, margin: '40px auto', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Section style={{ backgroundColor: '#1a1a1a', padding: '30px 40px', textAlign: 'center' }}>
          <Heading style={{ color: '#c9a84c', fontSize: 28, margin: 0 }}>J Huge International</Heading>
          <Text style={{ color: '#fff', fontSize: 14, margin: '8px 0 0', opacity: 0.8 }}>Commodity Trading Since 2008</Text>
        </Section>
        <Section style={{ padding: '40px' }}>
          <Heading style={{ color: '#1a1a1a', fontSize: 24, margin: '0 0 24px' }}>Solicitud Recibida</Heading>
          <Text style={{ fontSize: 16, color: '#333', margin: '0 0 16px' }}>Estimado/a {nombre},</Text>
          <Text style={{ fontSize: 16, lineHeight: '24px', color: '#333', margin: '0 0 16px' }}>
            Recibimos su solicitud y estamos levantando precio para compartirle una propuesta.
          </Text>
          <Section style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 6, padding: 20, margin: '24px 0' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 16px' }}>Detalles de su solicitud</Text>
            {cotizacionId && <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Referencia:</strong> {cotizacionId}</Text>}
            <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Producto:</strong> {producto}</Text>
            {cantidad && <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Cantidad:</strong> {cantidad} MT</Text>}
            <Text style={{ fontSize: 14, color: '#333', margin: '8px 0' }}><strong>Incoterm:</strong> {incoterm.toUpperCase()}</Text>
            {mensaje && (
              <Section style={{ backgroundColor: '#fff', border: '1px solid #d0d0d0', borderRadius: 4, padding: 12, marginTop: 16 }}>
                <Text style={{ fontSize: 13, color: '#666', margin: '0 0 8px', fontWeight: 'bold' }}>Su mensaje:</Text>
                <Text style={{ fontSize: 14, color: '#333', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '20px' }}>{mensaje}</Text>
              </Section>
            )}
          </Section>
          <Text style={{ fontSize: 16, lineHeight: '24px', color: '#333', margin: '0 0 16px' }}>
            Nuestro equipo está trabajando en su solicitud y nos pondremos en contacto a la brevedad.
          </Text>
          <Text style={{ fontSize: 16, color: '#333', margin: '32px 0 0', lineHeight: '24px' }}>
            Saludos cordiales,<br /><strong>Equipo JHI</strong><br />J Huge International
          </Text>
        </Section>
        <Hr style={{ borderColor: '#e0e0e0', margin: '0 40px' }} />
        <Section style={{ padding: '20px 40px', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999', margin: '8px 0' }}>
            <Link href="https://jhugeint.com" style={{ color: '#c9a84c', textDecoration: 'underline' }}>www.jhugeint.com</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
