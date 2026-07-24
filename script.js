// Capturamos el input donde el usuario sube la foto
const inputPlanilla = document.querySelector('input[type="file"]');

if (inputPlanilla) {
  inputPlanilla.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Puedes mostrar un loader/alerta de "Procesando con IA..."
    console.log("Enviando planilla a Gemini AI...");

    try {
      // 1. Convertimos la imagen a Base64
      const base64Image = await fileToBase64(file);

      // 2. Consultamos nuestro endpoint Serverless en Vercel
      const response = await fetch('/api/process-planilla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: file.type
        })
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      // 3. Obtenemos el arreglo de estudiantes procesado por la IA
      const estudiantes = await response.json();
      console.log("Estudiantes detectados:", estudiantes);

      // 4. Renderizamos los resultados en pantalla
      renderizarEstudiantes(estudiantes);

    } catch (error) {
      console.error("Error procesando la planilla:", error);
      alert("Hubo un error al leer la planilla con IA. Inténtalo de nuevo.");
    }
  });
}

// Función auxiliar para convertir el archivo de imagen a Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Función para calcular promedio y pintar las tarjetas en la pantalla
function renderizarEstudiantes(listaEstudiantes) {
  // Aquí calculas el promedio de cada estudiante recibido
  listaEstudiantes.forEach(estudiante => {
    const suma = estudiante.notas.reduce((acc, nota) => acc + parseFloat(nota), 0);
    const promedio = estudiante.notas.length > 0 ? (suma / estudiante.notas.length).toFixed(2) : 0.00;
    
    // Asignas el promedio calculado a la estructura
    estudiante.promedio = promedio;
  });

  // LLAMA AQUÍ A TU FUNCIÓN QUE PINTA LAS TARJETAS (Alertas tempranas, listas, etc.)
  // Por ejemplo: actualizarInterfaz(listaEstudiantes);
}