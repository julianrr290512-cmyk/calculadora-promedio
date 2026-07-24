const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta GEMINI_API_KEY en Vercel' });
    }

    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    // 1. Limpiar el prefijo base64 si la imagen viene con data:image/...
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = new GoogleGenAI({ apiKey });

    // 2. Solicitar extracción explícita
    const prompt = `Analiza esta planilla de calificaciones escolar.
Extrae la lista de estudiantes con sus notas numéricas.
Devuelve ÚNICAMENTE un arreglo JSON estricto con la siguiente estructura:
[
  {
    "nombre": "Nombre del Estudiante",
    "notas": [4.0, 3.5, 4.8]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    let textResponse = response.text || '';

    // 3. Limpieza de bloques markdown (```json ... ```)
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();

    const estudiantes = JSON.parse(textResponse);

    return res.status(200).json(estudiantes);

  } catch (error) {
    console.error('Error en Backend:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la planilla con Gemini', 
      details: error.message 
    });
  }
};