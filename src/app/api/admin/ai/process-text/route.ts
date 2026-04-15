import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Text and action are required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GOOGLE_MODEL || 'gemini-3-flash-preview' 
    });

    let prompt = '';

    switch (action) {
      case 'improve':
        prompt = `
          Eres un experto en comunicación corporativa comercial para J Huge International (JHI), una brokerage global de commodities.
          Tu tarea es mejorar el siguiente texto borrador escrito por un administrador. 
          Hazlo sonar más profesional, formal, persuasivo y adecuado para el comercio internacional de alto nivel.
          Mantenlo conciso pero elegante. No uses placeholders como [Nombre].
          
          Texto a mejorar: 
          "${text}"
          
          Responde SOLO con el texto mejorado, sin introducciones ni comentarios.
        `;
        break;
      case 'translate_en':
        prompt = `
          Eres un experto traductor comercial para J Huge International (JHI).
          Traduce el siguiente texto al INGLÉS con un tono corporativo y profesional de brokerage de commodities.
          Asegúrate de usar terminología técnica correcta de comercio exterior (Incoterms, MT, etc).
          
          Texto a traducir: 
          "${text}"
          
          Responde SOLO con el texto traducido al inglés.
        `;
        break;
      case 'translate_zh':
        prompt = `
          Eres un experto traductor comercial para J Huge International (JHI).
          Traduce el siguiente texto al CHINO (Mandarín Simplificado) con un tono corporativo y muy respetuoso para el mercado de China.
          Asegúrate de usar terminología comercial apropiada.
          
          Texto a traducir: 
          "${text}"
          
          Responde SOLO con el texto traducido al chino.
        `;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const processedText = response.text().trim();

    return NextResponse.json({ processedText });
  } catch (error) {
    console.error('[AI Processing Error]:', error);
    return NextResponse.json({ error: 'Failed to process text with AI' }, { status: 500 });
  }
}
