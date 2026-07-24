# 📄 PRD: Calculadora de Calificaciones y Promedio Académico

## 1. Visión del Producto
Una herramienta web interactiva diseñada para estudiantes y docentes que permite calcular el promedio ponderado de notas, evaluar el rendimiento académico en tiempo real y determinar la calificación mínima requerida para aprobar una asignatura.

## 2. Público Objetivo
* Estudiantes de secundaria y educación superior.
* Docentes que necesitan calcular notas definitivas rápidamente.

## 3. Problema a Resolver
Los estudiantes suelen calcular mal sus promedios cuando las notas tienen porcentajes (ponderaciones) diferentes, lo que genera incertidumbre sobre cuánta nota necesitan en sus evaluaciones finales para aprobar la materia.

## 4. Requisitos Funcionales
1. **Gestión de Asignaturas:** El usuario puede agregar y eliminar materias.
2. **Registro de Notas con Porcentaje:** Cada nota tiene un valor cuantitativo y un peso porcentual (ejemplo: Parcial 1 = 4.0 con peso del 30%).
3. **Cálculo de Promedio Automático:** Actualización del promedio global en tiempo real.
4. **Calculadora de Nota Mínima:** Función que indica qué nota necesita el estudiante en la evaluación final para alcanzar la calificación mínima aprobatoria (ej. 3.0 de 5.0).
5. **Persistencia de Datos:** Las notas ingresadas deben guardarse automáticamente en el navegador (`LocalStorage`) para no perderse al cerrar la página.

## 5. Requisitos No Funcionales
* **Usabilidad:** Interfaz limpia, intuitiva y adaptable a dispositivos móviles y computadoras.
* **Rendimiento:** Carga instantánea sin dependencias de servidores externos.
* **Compatibilidad:** Funciona en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).