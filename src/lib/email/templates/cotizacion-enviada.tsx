import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from '@react-email/components';

interface CotizacionEnviadaEmailProps {
  nombre: string;
  producto: string;
  incoterm: string;
  cotizacionId?: string;
}

export const CotizacionEnviadaEmail = ({
  nombre,
  producto,
  incoterm,
  cotizacionId,
}: CotizacionEnviadaEmailProps) => {
  const previewText = `Cotización formal – ${producto} – ${incoterm}`;

  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>J Huge International</Heading>
            <Text style={headerSubtitle}>Commodity Trading Since 2008</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={title}>Cotización Formal Enviada</Heading>
            
            <Text style={greeting}>Estimado/a {nombre},</Text>
            
            <Text style={paragraph}>
              Compartimos la cotización formal correspondiente a su solicitud.
            </Text>

            {/* Cotizacion Details */}
            <Section style={detailsBox}>
              <Text style={detailsTitle}>Detalles de la Cotización</Text>
              <Text style={detailItem}>
                <strong>Producto:</strong> {producto}
              </Text>
              <Text style={detailItem}>
                <strong>Incoterm:</strong> {incoterm.toUpperCase()}
              </Text>
              {cotizacionId && (
                <Text style={detailItem}>
                  <strong>Referencia:</strong> {cotizacionId}
                </Text>
              )}
            </Section>

            <Text style={paragraph}>
              Quedamos atentos a sus comentarios y confirmación.
            </Text>

            <Text style={signature}>
              Saludos cordiales,<br />
              <strong>Equipo JHI</strong><br />
              J Huge International
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este correo fue enviado automáticamente por el sistema de J Huge International.
            </Text>
            <Text style={footerText}>
              <Link href="https://jhugeint.com" style={footerLink}>
                www.jhugeint.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const body = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginTop: '40px',
  marginBottom: '40px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#1a1a1a',
  padding: '30px 40px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#c9a84c',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '8px 0 0 0',
  opacity: 0.8,
};

const content = {
  padding: '40px',
};

const title = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
};

const greeting = {
  fontSize: '16px',
  color: '#333333',
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#333333',
  margin: '0 0 16px 0',
};

const detailsBox = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
};

const detailsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 16px 0',
};

const detailItem = {
  fontSize: '14px',
  color: '#333333',
  margin: '8px 0',
};

const signature = {
  fontSize: '16px',
  color: '#333333',
  margin: '32px 0 0 0',
  lineHeight: '24px',
};

const divider = {
  borderColor: '#e0e0e0',
  margin: '0 40px',
};

const footer = {
  padding: '20px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#999999',
  margin: '8px 0',
};

const footerLink = {
  color: '#c9a84c',
  textDecoration: 'underline',
};

export default CotizacionEnviadaEmail;
