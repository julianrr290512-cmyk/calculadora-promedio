// ==========================================
// 1. REFERENCIAS AL DOM (Elementos de la UI)
// ==========================================
const imageInput = document.getElementById('imageInput');
const ocrStatus = document.getElementById('ocrStatus');
const ocrStatusText = document.getElementById('ocrStatusText');
const alertsSection = document.getElementById('alertsSection');
const alertsContainer = document.getElementById('alertsContainer');

// ==========================================
// 2. ESCUCHADORES DE EVENTOS (EventListeners)
// ==========================================
imageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    await procesarImagenPlanilla(file);
  }
});

// ==========================================
// 3. CAPA DE PROCESAMIENTO OCR (Tesseract.js)
// ==========================================
async function procesarImagenPlanilla(file) {
  // Mostramos el estado de carga al usuario
  ocrStatus.classList.remove('hidden');
  ocrStatusText.textContent = "Analizando texto e imagen de la planilla con OCR...";

  try {
    // Ejecutamos Tesseract OCR en idioma español ('spa')
    const result = await Tesseract.recognize(file, 'spa', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const porcentaje = Math.round(m.progress * 100);
          ocrStatusText.textContent = `Procesando IA: ${porcentaje}% completado...`;
        }
      }
    });

    const textoExtraido = result.data.text;
    console.log("Texto crudo extraído de la imagen (OCR):\n", textoExtraido);

    // Ocultamos cargador
    ocrStatus.classList.add('hidden');

    // Parseamos el texto extraído y evaluamos las alertas
    const datosEstructurados = parsearTextoPlanillaAvanzado(textoExtraido);
    console.log("Datos estructurados y limpios:\n", JSON.stringify(datosEstructurados, null, 2));
    evaluarAlertasTempranas(datosEstructurados);

  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    ocrStatusText.textContent = "❌ Error al leer la imagen. Intenta con una foto más clara y recta.";
  }
}

// ==========================================
// 4. NUEVO PARSEADOR DE TEXTO AVANZADO Y LIMPIO
// ==========================================
function parsearTextoPlanillaAvanzado(texto) {
  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
  const estudiantesValidos = [];

  // Expresión regular mejorada para identificar notas válidas entre 0.0 y 5.0
  const regexNotas = /\b[0-5]([\.,][0-9])?\b/g;

  lineas.forEach(linea => {
    const notasEncontradas = linea.match(regexNotas);
    
    // VALIDACIÓN: Solo procesamos líneas que tengan AL MENOS UNA nota válida
    if (notasEncontradas && notasEncontradas.length > 0) {
      const notasNumericas = notasEncontradas.map(n => parseFloat(n.replace(',', '.')));

      // NUEVA LIMPIEZA DE NOMBRE:
      // 1. Elimina números de la línea
      let nombreLimpio = linea.replace(/[0-9][\.,]?[0-9]?/g, '');
      // 2. Elimina caracteres basura comunes generados por el OCR ([, ], (, ), -, |, etc.)
      nombreLimpio = nombreLimpio.replace(/[\[\]\(\)\-\|,_:\.;]/g, '');
      // 3. Elimina espacios extra
      nombreLimpio = nombreLimpio.replace(/\s+/g, ' ').trim();

      // VALIDACIÓN: El nombre debe tener al menos 3 caracteres reales
      if (nombreLimpio.length > 3) {
        estudiantesValidos.push({
          nombre: nombreLimpio,
          notas: notasNumericas
        });
      }
    }
  });

  return estudiantesValidos;
}

// ==========================================
// 5. MOTOR DE REGLAS DE NEGOCIO Y ALERTAS
// ==========================================
function evaluarAlertasTempranas(estudiantes) {
  alertsContainer.innerHTML = ''; // Limpiar contenedor
  alertsSection.classList.add('hidden'); // Ocultar por defecto
  
  if (estudiantes.length === 0) {
    alertsSection.classList.remove('hidden');
    alertsContainer.innerHTML = `<p>⚠️ No se encontraron estudiantes con notas válidas en la imagen. Intenta con una imagen más clara o recortada.</p>`;
    return;
  }

  let estudiantesEnRiesgo = 0;

  estudiantes.forEach(estudiante => {
    // Calcular promedio simple de las notas evaluadas hasta la fecha
    const sumaNotas = estudiante.notas.reduce((acc, nota) => acc + nota, 0);
    const promedioActual = estudiante.notas.length > 0 ? (sumaNotas / estudiante.notas.length) : 0;
    const promedioFormateado = promedioActual.toFixed(2);

    // REGLA DE NEGOCIO: Si el promedio parcial es <= 3.0 se dispara Alerta Temprana
    if (promedioActual <= 3.0) {
      estudiantesEnRiesgo++;
      
      const tarjetaAlerta = document.createElement('div');
      tarjetaAlerta.className = 'alert-card-danger';
      tarjetaAlerta.innerHTML = `
        <span class="alert-badge">ALERTA CRÍTICA</span>
        <h3>${estudiante.nombre}</h3>
        <p><strong>Promedio actual acumulado:</strong> ${promedioFormateado}</p>
        <p><strong>Notas registradas:</strong> ${estudiante.notas.join(', ')}</p>
        <p><small>⚠️ Requiere plan de mejoramiento o citación mid-term.</small></p>
      `;
      alertsContainer.appendChild(tarjetaAlerta);
    }
  });

  // Mostrar u ocultar la sección de alertas según los resultados
  alertsSection.classList.remove('hidden');
  if (estudiantesEnRiesgo === 0) {
    alertsContainer.innerHTML = `<p>✅ ¡Excelente noticia! Ningún estudiante con notas válidas tiene un promedio parcial menor o igual a 3.0.</p>`;
  }
}