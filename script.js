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
  ocrStatusText.textContent = "Analizando texto e imagen de la planilla...";

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
    console.log("Texto extraído de la imagen:\n", textoExtraido);

    // Ocultamos cargador
    ocrStatus.classList.add('hidden');

    // Parseamos el texto extraído y evaluamos las alertas
    const datosEstructurados = parsearTextoPlanilla(textoExtraido);
    evaluarAlertasTempranas(datosEstructurados);

  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    ocrStatusText.textContent = "❌ Error al leer la imagen. Intenta con una foto más clara.";
  }
}

// ==========================================
// 4. PARSEADOR DE TEXTO A ESTRUCTURA DE DATOS
// ==========================================
// Convierte el texto plano en filas de estudiantes y notas
function parsearTextoPlanilla(texto) {
  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
  const estudiantes = [];

  // Expresión regular para identificar renglones con nombres y notas (ejemplo: Juan Perez 2.5 3.0)
  lineas.forEach(linea => {
    // Busca números decimales (ej: 2.5, 3.0, 4,2)
    const notasEncontradas = linea.match(/\b[0-5]([\.,][0-9])?\b/g);
    
    if (notasEncontradas && notasEncontradas.length > 0) {
      // Extrae el nombre quitando los números de la línea
      const nombre = linea.replace(/[0-9][\.,]?[0-9]?/g, '').trim();
      const notasNumericas = notasEncontradas.map(n => parseFloat(n.replace(',', '.')));

      if (nombre.length > 2) {
        estudiantes.push({
          nombre: nombre,
          notas: notasNumericas
        });
      }
    }
  });

  return estudiantes;
}

// ==========================================
// 5. MOTOR DE REGLAS DE NEGOCIO Y ALERTAS
// ==========================================
function evaluarAlertasTempranas(estudiantes) {
  alertsContainer.innerHTML = ''; // Limpiar contenedor
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
  if (estudiantesEnRiesgo > 0) {
    alertsSection.classList.remove('hidden');
  } else {
    alertsSection.classList.remove('hidden');
    alertsContainer.innerHTML = `<p>✅ ¡Excelente noticia! Ningún estudiante tiene un promedio parcial menor o igual a 3.0.</p>`;
  }
}