import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { HubSpotService } from '@/lib/hubspot/service';
import { EmailService } from '@/lib/email/service';
import { CotizacionData, ProductoCotizado, Incoterm, ESTADO_LABELS } from '@/lib/hubspot/types';

// ============================================================
// SYSTEM PROMPTS - Sales Agent (EN / ES / ZH)
// ============================================================

const SYSTEM_PROMPTS: Record<string, string> = {
  en: `You are a professional Sales Agent for J Huge International (JHI), a global commodity brokerage specializing in sugar, meat, grains, coffee, edible oils, dairy, and other agricultural products.

Always respond in English.
Be courteous, professional, confident, and enterprise-appropriate.

IMPORTANT RULES:
1. You only handle new quote requests or quote status inquiries.
2. For a NEW QUOTE, collect ALL of the following before closing the conversation:
   - Commodity type
   - Approximate quantity (in Metric Tons)
   - Country of origin
   - Destination country
   - Preferred Incoterms (FOB, CIF, CFR, etc.)
   - Full name and email of the person/company
3. For QUOTE STATUS, ask for a reference number or email.
4. When you have ALL the info for a NEW QUOTE, end with EXACTLY this phrase:
   "Perfect! I've completed our conversation. I'll send you the quote shortly."
   Then return a JSON block at the very end wrapped in \`\`\`json ... \`\`\`:
   {"action":"create_quote","data":{"email":"...","name":"...","commodity":"...","quantity":500,"origin":"Brazil","destination":"Spain","incoterms":"CIF","notes":"..."}}
5. For QUOTE STATUS checks, once you have the email or reference, say:
   "Let me check the status for you right away."
   Then return a JSON block at the very end wrapped in \`\`\`json ... \`\`\`:
   {"action":"check_status","data":{"email":"...","reference":"..."}}
   DO NOT use the "Perfect! I've completed..." phrase for status checks.

Never mention you are an AI. Always sign off as "JHI Team".`,

  es: `Eres un Agente de Ventas profesional de J Huge International (JHI), una brokerage global de commodities especializada en azúcar, carne, granos, café, aceites comestibles, lácteos y otros productos agrícolas.

Responde SIEMPRE en español.
Sé cortés, profesional, confiado y con tono enterprise.

REGLAS IMPORTANTES:
1. Solo atiendes solicitudes de cotización o consultas de estatus de cotización.
2. Para una NUEVA COTIZACIÓN, recopila TODA esta información antes de terminar:
   - Tipo de commodity
   - Cantidad aproximada (en Toneladas Métricas - MT)
   - País de origen
   - País de destino
   - Incoterms preferido (FOB, CIF, CFR, etc.)
   - Nombre completo y email de la persona/empresa
3. Para ESTATUS DE COTIZACIÓN:
   - Si el usuario proporciona un número de referencia (ej: 59154461092), úsalo directamente.
   - Si no hay referencia, pide el email del cliente.
   - Cuando tengas email O referencia, di: "Déjeme verificar el estado de su cotización ahora mismo."
   - Luego devuelve un bloque JSON al final dentro de \`\`\`json ... \`\`\`:
   {"action":"check_status","data":{"email":"...","reference":"59154461092"}}
   - NO uses la frase "¡Perfecto! Ya terminé..." para consultas de estatus.
4. Cuando tengas TODA la info de una NUEVA COTIZACIÓN, termina EXACTAMENTE con esta frase:
   "¡Perfecto! Ya terminé la conversación. Te enviaré la cotización pronto."
   Luego devuelve un bloque JSON al final dentro de \`\`\`json ... \`\`\`:
   {"action":"create_quote","data":{"email":"...","name":"...","commodity":"...","quantity":500,"origin":"Brasil","destination":"España","incoterms":"CIF","notes":"..."}}

Nunca menciones que eres una IA. Despídete siempre como "Equipo JHI".`,

  zh: `您是J Huge International (JHI)的专业销售代理，JHI是一家专注于糖、肉类、谷物、咖啡、食用油、乳制品和其他农产品的全球商品经纪公司。

始终用中文回复。
要有礼貌、专业、自信，并具备企业级沟通风格。

重要规则：
1. 您只处理新报价请求或报价状态查询。
2. 对于新报价，在结束对话前必须收集以下所有信息：
   - 商品类型
   - 大约数量（公吨）
   - 原产国
   - 目的的国家
   - 首选贸易术语（FOB、CIF、CFR等）
   - 个人/公司的全名和电子邮件
3. 对于报价状态查询，请要求提供参考编号或电子邮件。
4. 对于新报价，收集完所有必要信息后，用以下确切短语结束对话：
   "完美！我们的对话已完成。我将尽快向您发送报价。"
   然后在回复末尾返回一个结构化的JSON块，用\`\`\`json ... \`\`\`包裹：
   {"action":"create_quote","data":{"email":"...","name":"...","commodity":"...","quantity":500,"origin":"巴西","destination":"西班牙","incoterms":"CIF","notes":"..."}}
5. 对于状态查询，一旦获得电子邮件或参考编号，请说：
   "让我立即为您查看报价状态。"
   然后在回复末尾返回一个结构化的JSON块，用\`\`\`json ... \`\`\`包裹：
   {"action":"check_status","data":{"email":"...","reference":"..."}}
   不要对状态查询使用"完美！我们的对话已完成..."短语。

绝不要提及您是AI。始终以"JHI团队"署名。`,
};

// ============================================================
// HUBSPOT INTEGRATION - Now using centralized service
// ============================================================

// OLD FUNCTIONS REMOVED - Now using HubSpotService from @/lib/hubspot/service

// ============================================================
// CHECK QUOTE STATUS - Updated to use new service
// ============================================================

async function checkQuoteStatus(data: { email?: string; reference?: string }) {
  try {
    let deals: Awaited<ReturnType<typeof HubSpotService.cotizaciones.getByContactEmail>> = [];

    // If reference (ID) is provided, fetch directly
    if (data.reference && /^\d+$/.test(data.reference)) {
      const deal = await HubSpotService.cotizaciones.getById(data.reference);
      if (deal) deals = [deal];
    }

    // If no deals found by reference, try email
    if (deals.length === 0 && data.email) {
      deals = await HubSpotService.cotizaciones.getByContactEmail(data.email);
    }

    if (deals.length === 0) {
      return `\n\n---\n\n⚠️ No active quotes found for the provided information. Please contact our team for more details.`;
    }

    // Filter out closed deals
    const pendingDeals = deals.filter(
      (d) =>
        d.properties?.estado_cotizacion !== 'ganada' &&
        d.properties?.estado_cotizacion !== 'perdida'
    );

    // Sort by date ascending
    pendingDeals.sort((a, b) => {
      const dateA = a.properties?.createdate || '';
      const dateB = b.properties?.createdate || '';
      return dateA.localeCompare(dateB);
    });

    if (pendingDeals.length > 0) {
      const countMsg = pendingDeals.length === 1
        ? `Tiene **1 cotización pendiente**:`
        : `Tiene **${pendingDeals.length} cotizaciones pendientes**: Estas son sus cotizaciones listadas por fecha (más antigua primero):`;

      const summary = pendingDeals
        .map((d) => {
          const p = d.properties || {};
          const estadoRaw = p.estado_cotizacion || '';
          let estado = ESTADO_LABELS[estadoRaw];
          
          // Fallback: if no custom estado_cotizacion, map from HubSpot dealstage
          if (!estado) {
            const stageMap: Record<string, string> = {
              appointmentscheduled: 'Levantando precio',
              qualifiedtobuy: 'Validando logística',
              presentationscheduled: 'Preparando cotización',
              contractsent: 'Cotización enviada',
              decisionmakerboughtin: 'En negociación',
              closedwon: 'Ganada',
              closedlost: 'Perdida',
            };
            estado = stageMap[p.dealstage || ''] || 'En proceso';
          }
          
          let line = `• **${p.dealname}** — Estado: ${estado} | Cantidad: ${p.amount || 'N/A'} MT | Creada: ${p.createdate?.split('T')[0] || 'N/A'}`;
          
          // Include customer's message only if it's a real message (not auto-generated Origin/Destination text from chat)
          const desc = p.description || '';
          if (desc && !desc.startsWith('Origin:')) {
            line += `\n  _Mensaje:_ ${desc}`;
          }
          
          return line;
        })
        .join('\n\n');

      return `\n\n---\n\n📋 ${countMsg}\n\n${summary}`;
    }

    return `\n\n---\n\n✅ No tienes cotizaciones pendientes. Todas tus solicitudes han sido procesadas.`;
  } catch {
    return `\n\n---\n\n⚠️ Error al consultar el estado de su cotización. Por favor contacte al equipo JHI.`;
  }
}

// ============================================================
// API ROUTE
// ============================================================

function parseActionJson(text: string) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) return null;

  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

// ============================================================
// API ROUTE
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages = [], message, language = 'es' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.es;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: process.env.GOOGLE_MODEL || 'gemini-3-flash-preview',
      systemInstruction: systemPrompt,
    });

    // Build full conversation for Gemini (no startChat needed)
    const contents = [
      ...messages
        .slice(-20) // Keep last 20 messages for context
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    const reply = result.response.text() || 'I apologize, I could not process your request.';

    // Check if the AI response contains an action JSON block
    const actionData = parseActionJson(reply);

    if (actionData && process.env.HUBSPOT_API_KEY) {
      console.log('Detected action JSON:', JSON.stringify(actionData));

      if (actionData.action === 'create_quote' && actionData.data) {
        const { email, name, commodity, quantity, origin, destination, incoterms, notes } = actionData.data;

        // Normalize enum values to match HubSpot options (lowercase, no accents)
        const normalizeIncoterm = (val: string): Incoterm => {
          const lower = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (lower.includes('fob')) return 'fob';
          if (lower.includes('cif')) return 'cif';
          if (lower.includes('cfr')) return 'cfr';
          if (lower.includes('exw')) return 'exw';
          return 'otro';
        };

        const normalizeProducto = (val: string): ProductoCotizado => {
          const lower = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (lower.includes('azucar') || lower.includes('sugar')) return 'azucar';
          if (lower.includes('chicken') || lower.includes('paw')) return 'chicken_paws';
          return 'otro';
        };

        try {
          // First find or create the contact
          const contact = await HubSpotService.contacts.findOrCreate({
            email: email,
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ').slice(1).join(' ') || '',
          });

          // Map to new schema with normalized values
          const cotizacionData: CotizacionData = {
            producto_cotizado: normalizeProducto(commodity || 'otro'),
            producto_nombre_original: commodity, // Keep original name for dealname display
            incoterm: normalizeIncoterm(incoterms || 'otro'),
            tipo_cliente_operacion: 'cliente_directo',
            mercado_origen: origin,
            contactId: contact.id,
            contactEmail: email,
            amount: quantity,
            description: `Origin: ${origin}\nDestination: ${destination}\nIncoterms: ${incoterms}\nContact: ${email}`,
          };

          // Create cotizacion with contact association
          const cotizacion = await HubSpotService.cotizaciones.create(cotizacionData);

          // Send confirmation email to client
          try {
            await EmailService.sendLevantandoPrecio(email, {
              nombre: name.split(' ')[0] || name,
              producto: commodity,
              incoterm: incoterms,
              cantidad: String(quantity),
              cotizacionId: cotizacion.id,
            });
            // eslint-disable-next-line no-console
            console.log('[Chat] Confirmation email sent to:', email);
          } catch (emailError) {
            // eslint-disable-next-line no-console
            console.error('[Chat] Failed to send confirmation email:', emailError);
          }

          // eslint-disable-next-line no-console
          console.log('[Chat] Contact ID:', contact.id, '| Cotización created successfully, ID:', cotizacion.id);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[Chat] Failed to create cotizacion:', err);
        }
      }

      if (actionData.action === 'check_status' && actionData.data) {
        const { email, reference } = actionData.data;

        console.log('Checking quote status for:', email || reference);

        try {
          const statusInfo = await checkQuoteStatus({ email, reference });
          return NextResponse.json(
            { message: reply + statusInfo },
            { status: 200 }
          );
        } catch {
          console.error('Status check failed');
        }
      }
    }

    return NextResponse.json({ message: reply }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Chat API error:', error.message);
    }

    const isQuotaError =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      (error.message.includes('quota') || error.message.includes('rate limit'));

    const message = isQuotaError
      ? 'I\'m currently at capacity. Please try again shortly, or use the contact form to reach our team.'
      : 'I\'m having trouble connecting right now. Please try again shortly.';

    return NextResponse.json({ message }, { status: 503 });
  }
}
