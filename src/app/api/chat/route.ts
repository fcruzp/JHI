import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
3. Para ESTATUS DE COTIZACIÓN, pide número de referencia o email.
4. Cuando tengas TODA la info de una NUEVA COTIZACIÓN, termina EXACTAMENTE con esta frase:
   "¡Perfecto! Ya terminé la conversación. Te enviaré la cotización pronto."
   Luego devuelve un bloque JSON al final dentro de \`\`\`json ... \`\`\`:
   {"action":"create_quote","data":{"email":"...","name":"...","commodity":"...","quantity":500,"origin":"Brasil","destination":"España","incoterms":"CIF","notes":"..."}}
5. Para consultas de ESTATUS, una vez tengas el email o referencia, di:
   "Déjeme verificar el estado de su cotización ahora mismo."
   Luego devuelve un bloque JSON al final dentro de \`\`\`json ... \`\`\`:
   {"action":"check_status","data":{"email":"...","reference":"..."}}
   NO uses la frase "¡Perfecto! Ya terminé..." para consultas de estatus.

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
// HUBSPOT INTEGRATION
// ============================================================

const HUBSPOT_API_URL = 'https://api.hubapi.com';

async function findOrCreateContact(data: { name: string; email: string }) {
  // Try to find existing contact by email
  const searchRes = await fetch(
    `${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: data.email,
              },
            ],
          },
        ],
      }),
    }
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.results?.length > 0) {
      console.log('Contact already exists, reusing ID:', searchData.results[0].id);
      return searchData.results[0];
    }
  }

  // Create new contact
  return createHubSpotContact(data);
}

async function createHubSpotContact(data: { name: string; email: string }) {
  const res = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        firstname: data.name.split(' ')[0] || '',
        lastname: data.name.split(' ').slice(1).join(' ') || '',
        email: data.email,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('HubSpot contact creation failed:', err);
    return null;
  }

  return res.json();
}

async function createHubSpotDeal(
  data: {
    commodity: string;
    quantity: number | string;
    origin: string;
    destination: string;
    incoterms: string;
    notes: string;
    email: string;
  },
  contactId: string | null
) {
  // Build deal name using standard HubSpot fields
  const dealName = `${data.commodity} — ${data.quantity} MT from ${data.origin} to ${data.destination} (${data.incoterms})`;

  const body: Record<string, unknown> = {
    properties: {
      dealname: dealName,
      amount: String(data.quantity),
      dealstage: 'appointmentscheduled',
      description: data.notes || `Origin: ${data.origin}\nIncoterms: ${data.incoterms}\nContact: ${data.email}`,
    },
  };

  // Only add association if we have a valid contact
  if (contactId) {
    body.associations = [
      {
        to: { id: String(contactId) },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: '3',
          },
        ],
      },
    ];
  }

  const res = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('HubSpot deal creation failed:', err);

    // Fallback: try creating deal without associations
    console.log('Retrying deal without associations...');
    const { associations, ...bodyNoAssoc } = body;
    const fallbackRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify(bodyNoAssoc),
    });

    if (!fallbackRes.ok) {
      const fallbackErr = await fallbackRes.json().catch(() => ({}));
      console.error('HubSpot deal creation fallback also failed:', fallbackErr);
      return null;
    }

    return fallbackRes.json();
  }

  return res.json();
}

// ============================================================
// CHECK QUOTE STATUS
// ============================================================

async function checkQuoteStatus(data: { email?: string; reference?: string }) {
  let deals: any[] = [];

  // First try to find contact by email
  let contactId: string | null = null;
  if (data.email) {
    const searchRes = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: data.email,
                },
              ],
            },
          ],
        }),
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.results?.length > 0) {
        contactId = searchData.results[0].id;
      }
    }
  }

  // If we found a contact, get their associated deals
  if (contactId) {
    const dealsRes = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}/associations/deals`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
      }
    );

    if (dealsRes.ok) {
      const dealsData = await dealsRes.json();
      const dealIds = dealsData.results?.map((d: { id: string }) => d.id) || [];

      // Fetch deal details
      for (const dealId of dealIds.slice(0, 10)) {
        const dealRes = await fetch(
          `${HUBSPOT_API_URL}/crm/v3/objects/deals/${dealId}?properties=dealname,dealstage,amount,description,createdate`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            },
          }
        );

        if (dealRes.ok) {
          deals.push(await dealRes.json());
        }
      }
    }
  }

  // If no deals found via contact, fallback to searching all open deals
  if (deals.length === 0 && data.email) {
    const searchRes = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/deals/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'hs_is_closed_won',
                  operator: 'EQ',
                  value: 'false',
                },
              ],
            },
          ],
          sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
          limit: 10,
          properties: ['dealname', 'dealstage', 'amount', 'description', 'createdate'],
        }),
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      deals = (searchData.results || []).filter(
        (d: { properties?: Record<string, string> }) =>
          d.properties?.description?.includes(data.email!)
      );
    }
  }

  // If we found deals, format a status summary
  if (deals.length > 0) {
    // Filter out closed deals — only count pending
    const pendingDeals = deals.filter(
      (d) =>
        d.properties?.dealstage !== 'closedwon' &&
        d.properties?.dealstage !== 'closedlost'
    );

    // Sort by date ascending (oldest first)
    pendingDeals.sort((a, b) => {
      const dateA = a.properties?.createdate || '';
      const dateB = b.properties?.createdate || '';
      return dateA.localeCompare(dateB);
    });

    const stageNames: Record<string, string> = {
      appointmentscheduled: '📅 Scheduled',
      qualifiedtobuy: '✅ Qualified',
      presentationscheduled: '📊 Presentation Scheduled',
      decisionmakerboughtin: '🤝 Decision Maker Review',
      contractsent: '📄 Contract Sent',
      closedwon: '🎉 Closed Won',
      closedlost: '❌ Closed Lost',
    };

    if (pendingDeals.length > 0) {
      const countMsg = pendingDeals.length === 1
        ? `Tiene **1 cotización pendiente**:`
        : `Tiene **${pendingDeals.length} cotizaciones pendientes**: Estas son sus cotizaciones listadas por fecha (más antigua primero):`;

      const summary = pendingDeals
        .map((d: { id: string; properties?: Record<string, string> }) => {
          const p = d.properties || {};
          const stage = stageNames[p.dealstage || ''] || p.dealstage || 'Unknown';
          return `• **${p.dealname}** — Stage: ${stage} | Cantidad: ${p.amount || 'N/A'} MT | Creada: ${p.createdate?.split('T')[0] || 'N/A'}`;
        })
        .join('\n\n');

      return `\n\n---\n\n📋 ${countMsg}\n\n${summary}`;
    }

    return `\n\n---\n\n✅ No tienes cotizaciones pendientes. Todas tus solicitudes han sido procesadas.`;
  }

  return `\n\n---\n\n⚠️ No active quotes found for the provided information. Please contact our team for more details.`;
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
      model: process.env.GOOGLE_MODEL || 'gemini-2.5-flash',
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
        maxOutputTokens: 800,
      },
    });

    const reply = result.response.text() || 'I apologize, I could not process your request.';

    // Check if the AI response contains an action JSON block
    const actionData = parseActionJson(reply);

    if (actionData && process.env.HUBSPOT_API_KEY) {
      console.log('Detected action JSON:', JSON.stringify(actionData));

      if (actionData.action === 'create_quote' && actionData.data) {
        const { email, name, ...dealData } = actionData.data;

        let contactId: string | null = null;

        // Try to find or create contact
        if (email) {
          console.log('Finding or creating HubSpot contact for:', email);
          try {
            const contact = await findOrCreateContact({
              name: name || 'JHI Lead',
              email,
            });

            if (contact) {
              contactId = contact.id;
              console.log('Contact ready, ID:', contactId);
            }
          } catch (err) {
            console.error('Contact operation failed, creating deal without contact:', err);
          }
        }

        // Always create the deal — even if contact failed
        console.log('Creating HubSpot deal (contactId:', contactId, ')');
        const deal = await createHubSpotDeal(dealData, contactId);
        if (deal) {
          console.log('Deal saved successfully, ID:', deal.id);
        } else {
          console.error('Failed to create deal in HubSpot');
        }
      }

      if (actionData.action === 'check_status' && actionData.data) {
        const { email, reference } = actionData.data;

        console.log('Checking quote status for:', email || reference);

        try {
          const statusInfo = await checkQuoteStatus({ email, reference });
          // Append status info to the AI response so the user sees it
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
