export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { imageBase64, mimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // 🔒 Clave privada en Vercel

  if (!apiKey) {
    return res.status(500).json({ error: 'La API Key no está configurada en Vercel.' });
  }

  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'Faltan datos de la imagen.' });
  }

  try {
    const promptText = `
      Analiza la imagen adjunta de esta planilla de notas escolar.
      Extrae el nombre completo de cada estudiante y todas sus notas numéricas registradas.
      
      Devuelve ÚNICAMENTE un arreglo JSON estricto sin texto adicional ni formato Markdown triple comilla, con esta estructura exacta:
      [
        {"nombre": "Nombre Apellido", "notas": [4.5, 3.0, 2.8]}
      ]
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64.split(',')[1] || imageBase64
              }
            }
          ]
        }]
      })
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0].content) {
      throw new Error('La respuesta de la IA no fue válida.');
    }

    const rawText = data.candidates[0].content.parts[0].text.trim();
    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const estudiantes = JSON.parse(cleanJsonText);

    return res.status(200).json(estudiantes);

  } catch (error) {
    console.error("Error en Backend:", error);
    return res.status(500).json({ error: 'Error interno al procesar la planilla con IA.' });
  }
}