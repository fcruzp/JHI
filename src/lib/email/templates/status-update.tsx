import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';
import React from 'react';

interface StatusUpdateEmailProps {
  nombre: string;
  producto: string;
  incoterm: string;
  estado: string; // The translated friendly label
  comentario: string; // The manual text
  cotizacionId?: string;
  cantidad?: string;
}

export const StatusUpdateEmail = ({ 
  nombre, 
  producto, 
  incoterm, 
  estado, 
  comentario, 
  cotizacionId,
  cantidad 
}: StatusUpdateEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <Container style={{ backgroundColor: '#fff', maxWidth: 600, margin: '40px auto', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Section style={{ backgroundColor: '#1a1a1a', padding: '30px 40px', textAlign: 'center' }}>
          <Heading style={{ color: '#c9a84c', fontSize: 24, margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>J Huge International</Heading>
          <Text style={{ color: '#fff', fontSize: 12, margin: '8px 0 0', opacity: 0.7 }}>Actualización de Cotización</Text>
        </Section>

        <Section style={{ padding: '40px' }}>
          <Heading style={{ color: '#1a1a1a', fontSize: 22, margin: '0 0 24px' }}>Novedades en su propuesta</Heading>
          
          <Text style={{ fontSize: 16, color: '#333', margin: '0 0 20px' }}>Estimado/a {nombre},</Text>
          
          <Text style={{ fontSize: 16, lineHeight: '24px', color: '#1a1a1a', margin: '0 0 24px', whiteSpace: 'pre-wrap' }}>
            {comentario}
          </Text>

          <Section style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, margin: '32px 0' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 16px', textTransform: 'uppercase' }}>Resumen del Estatus</Text>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
              <Text style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>Referencia:</Text>
              <Text style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 'bold', margin: '4px 0' }}>{cotizacionId || '-'}</Text>
              
              <Text style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>Producto:</Text>
              <Text style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 'bold', margin: '4px 0' }}>{producto}</Text>

              {cantidad && (
                <>
                  <Text style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>Cantidad:</Text>
                  <Text style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 'bold', margin: '4px 0' }}>{cantidad} MT</Text>
                </>
              )}

              <Text style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>Incoterm:</Text>
              <Text style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 'bold', margin: '4px 0' }}>{incoterm.toUpperCase()}</Text>

              <Text style={{ fontSize: 13, color: '#666', margin: '12px 0 4px' }}>Estatus Actual:</Text>
              <Text style={{ 
                fontSize: 14, 
                backgroundColor: '#c9a84c', 
                color: '#fff', 
                padding: '4px 12px', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                display: 'inline-block',
                margin: '8px 0' 
              }}>
                {estado}
              </Text>
            </div>
          </Section>

          <Text style={{ fontSize: 16, color: '#333', margin: '32px 0 0', lineHeight: '24px' }}>
            Quedamos a su entera disposición para cualquier consulta adicional.<br />
            <br />
            Saludos cordiales,<br />
            <strong>Equipo JHI</strong><br />
            J Huge International
          </Text>
        </Section>

        <Hr style={{ borderColor: '#e0e0e0', margin: '0 40px' }} />
        
        <Section style={{ padding: '20px 40px', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999', margin: '8px 0' }}>
            <Link href="https://jhugeinternational.com" style={{ color: '#c9a84c', textDecoration: 'underline' }}>www.jhugeinternational.com</Link>
          </Text>
          <Text style={{ fontSize: 10, color: '#bbb', margin: '4px 0' }}>
            Este es un correo informativo sobre su propuesta comercial activa.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
