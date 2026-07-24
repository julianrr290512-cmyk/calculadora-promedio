# 📄 TRD: Calculadora de Calificaciones y Promedio Académico

## 1. Introducción
Este documento detalla los requisitos técnicos para la implementación de la "Calculadora de Calificaciones y Promedio Académico", basándose en el PRD (01-PRD.md).

## 2. Arquitectura Propuesta
La aplicación será una Single Page Application (SPA) desarrollada con tecnologías web estándar (HTML, CSS, JavaScript) sin dependencias de frameworks pesados o backends complejos, para asegurar un rendimiento óptimo y una carga instantánea.

## 3. Tecnologías Clave
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+).
*   **Persistencia de Datos:** `LocalStorage` del navegador.
*   **Gestión de Estado:** Vanilla JavaScript o una librería ligera si se considera necesario para la complejidad futura (ej. Redux, Vuex, etc., aunque inicialmente no se prevé).
*   **Construcción/Bundling:** No se requiere un bundler complejo inicialmente. Se puede usar un enfoque modular con ES Modules si la complejidad lo amerita.

## 4. Requisitos Funcionales Técnicos

### 4.1. Gestión de Asignaturas
*   **FEAT-001:** Implementar una interfaz de usuario para agregar nuevas asignaturas dinámicamente.
*   **FEAT-002:** Implementar una interfaz de usuario para eliminar asignaturas existentes.
*   **FEAT-003:** Cada asignatura debe tener un identificador único (ej. `UUID` o índice).

### 4.2. Registro de Notas con Porcentaje
*   **FEAT-004:** Desarrollar un componente de entrada para el valor de la nota (numérico, ej. 0.0 a 5.0).
*   **FEAT-005:** Desarrollar un componente de entrada para el peso porcentual de la nota (numérico, ej. 0 a 100).
*   **FEAT-006:** Validar que la suma de los porcentajes de las notas de una asignatura no exceda el 100%.
*   **FEAT-007:** Asociar cada nota y su porcentaje a una asignatura específica.

### 4.3. Cálculo de Promedio Automático
*   **FEAT-008:** Implementar una función JavaScript para calcular el promedio ponderado de las notas de una asignatura.
*   **FEAT-009:** Actualizar el promedio global en tiempo real cada vez que se modifique una nota o porcentaje.
*   **FEAT-010:** Mostrar el promedio con una precisión de dos decimales.

### 4.4. Calculadora de Nota Mínima
*   **FEAT-011:** Desarrollar una función que calcule la nota mínima requerida en una evaluación final para alcanzar un promedio objetivo (ej. 3.0).
*   **FEAT-012:** La función debe considerar las notas ya ingresadas y sus respectivos porcentajes.
*   **FEAT-013:** Mostrar el resultado de la nota mínima requerida en la interfaz de usuario.

### 4.5. Persistencia de Datos
*   **FEAT-014:** Utilizar `LocalStorage` para almacenar y recuperar el estado completo de la aplicación (asignaturas, notas, porcentajes).
*   **FEAT-015:** Implementar funciones para serializar (JSON.stringify) y deserializar (JSON.parse) los datos antes de guardarlos y cargarlos de `LocalStorage`.
*   **FEAT-016:** Guardar los datos automáticamente cada vez que haya un cambio en el estado de la aplicación.

## 5. Requisitos No Funcionales Técnicos

### 5.1. Usabilidad (UI/UX)
*   **NFEAT-001:** Implementar un diseño responsivo utilizando CSS Media Queries para asegurar la adaptabilidad a diferentes tamaños de pantalla (móviles, tablets, desktops).
*   **NFEAT-002:** Utilizar un diseño de interfaz de usuario limpio y moderno, priorizando la legibilidad y la facilidad de interacción.
*   **NFEAT-003:** Asegurar que todos los elementos interactivos sean accesibles mediante teclado.

### 5.2. Rendimiento
*   **NFEAT-004:** Optimizar el código JavaScript para minimizar el tiempo de ejecución y evitar bloqueos del hilo principal.
*   **NFEAT-005:** Minimizar el uso de recursos del navegador y las operaciones costosas de DOM.
*   **NFEAT-006:** La aplicación debe cargar en menos de 2 segundos en conexiones de banda ancha estándar.

### 5.3. Compatibilidad
*   **NFEAT-007:** Asegurar la compatibilidad con las últimas dos versiones estables de los navegadores Chrome, Firefox, Edge y Safari.
*   **NFEAT-008:** Evitar el uso de APIs o características de JavaScript que no estén ampliamente soportadas por los navegadores objetivo.

## 6. Consideraciones de Implementación
*   **Estructura de Archivos:** Organizar el código en módulos lógicos (ej. `components/`, `utils/`, `services/`).
*   **Manejo de Errores:** Implementar manejo de errores básico para entradas de usuario inválidas.
*   **Pruebas:** Considerar la implementación de pruebas unitarias para las funciones de cálculo críticas (promedio, nota mínima).
