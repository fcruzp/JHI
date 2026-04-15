/**
 * Script para verificar y listar todas las propiedades del objeto Cotizaciones en HubSpot
 * Esto nos permite encontrar los nombres internos reales de las propiedades
 *
 * Uso: npx tsx scripts/check-hubspot-properties.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_API_URL = 'https://api.hubapi.com';
const COTIZACIONES_OBJECT_ID = '0-3'; // Custom object ID

if (!HUBSPOT_API_KEY) {
  console.error('❌ HUBSPOT_API_KEY not found in environment');
  process.exit(1);
}

async function checkProperties() {
  console.log('🔍 Checking HubSpot properties for Cotizaciones object...\n');

  try {
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/properties/${COTIZACIONES_OBJECT_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Error fetching properties:', await response.text());
      process.exit(1);
    }

    const data = await response.json();
    const properties = data.results || [];

    console.log(`📊 Found ${properties.length} properties in HubSpot:\n`);

    // Properties we're looking for
    const targetProperties = [
      'tipodeproceso',
      'estadodelsuplidor',
      'fechasolicituda_suplidor',
      'fecharespuestadel_suplidor',
      'estadodela_cotizacion',
      'trial_solicitado',
      'resultadodela_cotizacion',
    ];

    console.log('🎯 Target Properties (Phase 4):');
    console.log('─'.repeat(80));

    for (const target of targetProperties) {
      const found = properties.find(
        (p: any) =>
          p.name.toLowerCase().includes(target.toLowerCase()) ||
          p.label.toLowerCase().includes(target.replace(/_/g, ' ').toLowerCase())
      );

      if (found) {
        console.log(`✅ FOUND: "${found.name}" (label: "${found.label}", type: ${found.type})`);
      } else {
        console.log(`❌ NOT FOUND: "${target}"`);
      }
    }

    console.log('\n');
    console.log('📋 All properties containing target keywords:');
    console.log('─'.repeat(80));

    const keywords = ['proceso', 'suplidor', 'cotizacion', 'trial', 'resultado'];

    for (const prop of properties) {
      const matchesKeyword = keywords.some(kw =>
        prop.name.toLowerCase().includes(kw) ||
        prop.label.toLowerCase().includes(kw)
      );

      if (matchesKeyword) {
        console.log(`• ${prop.name}`);
        console.log(`  Label: "${prop.label}"`);
        console.log(`  Type: ${prop.type}`);
        if (prop.options) {
          console.log(`  Options: ${prop.options.map((o: any) => o.value).join(', ')}`);
        }
        console.log('');
      }
    }

    // Check for similar property names
    console.log('🔎 Looking for similar property names:');
    console.log('─'.repeat(80));

    for (const target of targetProperties) {
      const similar = properties.filter(
        (p: any) =>
          p.name.toLowerCase().includes(target.split('_')[0]) ||
          p.label.toLowerCase().includes(target.split('_')[0])
      );

      if (similar.length > 0) {
        console.log(`\nFor "${target}":`);
        similar.forEach((p: any) => {
          console.log(`  • ${p.name} (label: "${p.label}")`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkProperties();
