import { Html, Head, Body, Container, Section, Text, Heading, Hr } from '@react-email/components';

interface ClientCommentInternalEmailProps {
  customerEmail?: string;
  customerName?: string;
  reference?: string;
  comment: string;
  summary?: string;
}

export const ClientCommentInternalEmail = ({
  customerEmail,
  customerName,
  reference,
  comment,
  summary,
}: ClientCommentInternalEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <Container
        style={{
          backgroundColor: '#fff',
          maxWidth: 600,
          margin: '40px auto',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Section style={{ backgroundColor: '#1a1a1a', padding: '30px 40px', textAlign: 'center' }}>
          <Heading style={{ color: '#c9a84c', fontSize: 28, margin: 0 }}>JHI - Comentario del Cliente (Chat)</Heading>
        </Section>

        <Section style={{ padding: '40px' }}>
          <Heading style={{ color: '#f59e0b', fontSize: 20, margin: '0 0 16px' }}>Detalles</Heading>
          {customerName && (
            <Text style={{ fontSize: 14, color: '#333', margin: '0 0 10px' }}>
              <strong>Nombre:</strong> {customerName}
            </Text>
          )}
          {customerEmail && (
            <Text style={{ fontSize: 14, color: '#333', margin: '0 0 10px' }}>
              <strong>Email:</strong> {customerEmail}
            </Text>
          )}
          {reference && (
            <Text style={{ fontSize: 14, color: '#333', margin: '0 0 10px' }}>
              <strong>Referencia cotización:</strong> {reference}
            </Text>
          )}

          {summary && (
            <Section
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                padding: 16,
                margin: '18px 0',
              }}
            >
              <Text style={{ fontSize: 13, color: '#111827', margin: '0 0 6px' }}>
                <strong>Resumen (IA):</strong>
              </Text>
              <Text style={{ fontSize: 13, color: '#111827', margin: 0, whiteSpace: 'pre-wrap' }}>{summary}</Text>
            </Section>
          )}

          <Section
            style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 6,
              padding: 16,
              margin: '18px 0 0',
            }}
          >
            <Text style={{ fontSize: 13, color: '#111827', margin: '0 0 6px' }}>
              <strong>Comentario del cliente:</strong>
            </Text>
            <Text style={{ fontSize: 13, color: '#111827', margin: 0, whiteSpace: 'pre-wrap' }}>{comment}</Text>
          </Section>
        </Section>

        <Hr style={{ borderColor: '#e0e0e0', margin: '0 40px' }} />
        <Section style={{ padding: '20px 40px', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999' }}>Notificación interna - JHI</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

