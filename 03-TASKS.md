# 📄 TASKS: Calculadora de Calificaciones y Promedio Académico

## 1. Configuración Inicial del Proyecto
*   [x] Crear la estructura básica de archivos (index.html, style.css, script.js).
*   [x] Vincular style.css y script.js a index.html.

## 2. Desarrollo de la Interfaz de Usuario (HTML/CSS)

### 2.1. Estructura General
*   [x] Crear el contenedor principal de la aplicación.
*   [x] Implementar encabezado y pie de página.

### 2.2. Gestión de Asignaturas
*   [x] Diseñar la sección para agregar nuevas asignaturas (input, botón).
*   [x] Crear un área para listar las asignaturas añadidas.
*   [ ] Implementar botones para eliminar asignaturas.

### 2.3. Registro de Notas y Porcentajes
*   [ ] Diseñar la interfaz para añadir notas y sus porcentajes dentro de cada asignatura.
*   [ ] Incluir campos de entrada para el valor de la nota y el porcentaje.
*   [ ] Mostrar las notas registradas con su valor y porcentaje.

### 2.4. Visualización de Resultados
*   [ ] Crear un espacio para mostrar el promedio actual de cada asignatura.
*   [x] Diseñar la sección de la calculadora de nota mínima (input para promedio objetivo, área de resultado).

### 2.5. Estilos y Responsividad
*   [x] Aplicar estilos CSS para una interfaz limpia e intuitiva.
*   [x] Implementar Media Queries para asegurar la responsividad en diferentes dispositivos.

## 3. Implementación de la Lógica (JavaScript)

### 3.1. Gestión de Asignaturas
*   [ ] Función para agregar una nueva asignatura al modelo de datos.
*   [ ] Función para eliminar una asignatura del modelo de datos y de la UI.
*   [ ] Generar IDs únicos para cada asignatura.

### 3.2. Registro y Validación de Notas
*   [ ] Función para añadir una nota con su porcentaje a una asignatura específica.
*   [ ] Función para validar que la suma de porcentajes de una asignatura no exceda el 100%.
*   [ ] Actualizar la UI dinámicamente al añadir/eliminar notas.

### 3.3. Cálculo de Promedio
*   [ ] Función `calculateWeightedAverage(notes)` para calcular el promedio ponderado.
*   [ ] Integrar la función de cálculo para que se ejecute en tiempo real al modificar notas/porcentajes.
*   [ ] Mostrar el promedio con dos decimales en la UI.

### 3.4. Calculadora de Nota Mínima
*   [ ] Función `calculateMinGrade(currentAverage, targetAverage, remainingPercentage)` para determinar la nota mínima.
*   [ ] Vincular esta función a la UI para que el usuario pueda ingresar el promedio objetivo y ver el resultado.

### 3.5. Persistencia de Datos
*   [ ] Función `saveData()` para guardar el estado completo de la aplicación en `LocalStorage`.
*   [ ] Función `loadData()` para cargar el estado al iniciar la aplicación.
*   [ ] Implementar la serialización y deserialización (JSON.stringify/parse).
*   [ ] Llamar a `saveData()` cada vez que haya un cambio significativo en el estado.

### 3.6. Manejo de Eventos y Actualización de UI
*   [ ] Escuchadores de eventos para botones (agregar/eliminar asignatura, agregar nota).
*   [ ] Actualizar dinámicamente la interfaz de usuario en respuesta a las interacciones del usuario y los cambios en los datos.

## 4. Pruebas y Refinamiento
*   [ ] Pruebas unitarias para las funciones de cálculo (`calculateWeightedAverage`, `calculateMinGrade`).
*   [ ] Pruebas de integración para la persistencia de datos.
*   [ ] Pruebas de usabilidad y responsividad en diferentes navegadores y dispositivos.
*   [ ] Refinamiento de la interfaz de usuario y corrección de errores.