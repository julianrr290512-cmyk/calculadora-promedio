document.addEventListener('DOMContentLoaded', () => {

    const subjectNameInput = document.getElementById('new-subject-name');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const subjectsContainer = document.getElementById('subjects-container');

    // Módulo OCR
    const ocrInput = document.getElementById('ocr-image-input');
    const processOcrBtn = document.getElementById('process-ocr-btn');
    const ocrStatus = document.getElementById('ocr-status');
    const ocrResults = document.getElementById('ocr-results');

    // Estado principal
    let subjects = JSON.parse(localStorage.getItem('academic_v2_data')) || [];

    function save() {
        localStorage.setItem('academic_v2_data', JSON.stringify(subjects));
        render();
    }

    // --- CÁLCULOS MATEMÁTICOS ---
    function getCategoryAverage(category) {
        if (!category.grades || category.grades.length === 0) return 0;
        const sum = category.grades.reduce((a, b) => a + b, 0);
        return sum / category.grades.length;
    }

    function getSubjectAverage(subject) {
        if (!subject.categories || subject.categories.length === 0) return 0;
        let totalWeighted = 0;
        
        subject.categories.forEach(cat => {
            const catAvg = getCategoryAverage(cat);
            totalWeighted += (catAvg * (cat.percentage / 100));
        });

        return totalWeighted;
    }

    // --- INTERFAZ PRINCIPAL ---
    function render() {
        subjectsContainer.innerHTML = '';

        subjects.forEach(subject => {
            const subAvg = getSubjectAverage(subject);
            const card = document.createElement('div');
            card.className = 'card subject-card';

            let categoriesHTML = '';
            subject.categories.forEach((cat, cIdx) => {
                const catAvg = getCategoryAverage(cat);
                
                let chipsHTML = cat.grades.map((g, gIdx) => `
                    <span class="chip">
                        ${g.toFixed(1)} 
                        <i class="fas fa-times" onclick="deleteGrade(${subject.id}, ${cIdx}, ${gIdx})" style="cursor:pointer"></i>
                    </span>
                `).join('');

                categoriesHTML += `
                    <div class="category-box">
                        <div class="category-header">
                            <span>${cat.name} (${cat.percentage}%)</span>
                            <span>Promedio: <strong>${catAvg.toFixed(2)}</strong></span>
                            <button class="btn-danger" onclick="deleteCategory(${subject.id}, ${cIdx})"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="grades-chips">${chipsHTML}</div>
                        
                        <!-- Agregar Nota a la Categoría -->
                        <div class="inline-form">
                            <input type="number" step="0.1" id="val-${subject.id}-${cIdx}" placeholder="Nota (Ej: 4.5)">
                            <button class="btn-accent btn-small" onclick="addGrade(${subject.id}, ${cIdx})">
                                <i class="fas fa-plus"></i> Nota
                            </button>
                        </div>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="subject-header">
                    <h2>${subject.name}</h2>
                    <span class="badge-score ${getScoreColor(subAvg)}">
                        Definitiva: ${subAvg.toFixed(2)}
                    </span>
                    <button class="btn-danger" onclick="deleteSubject(${subject.id})"><i class="fas fa-trash"></i> Borrar Materia</button>
                </div>

                ${categoriesHTML}

                <!-- Agregar Categoría -->
                <div class="inline-form" style="margin-top: 15px;">
                    <input type="text" id="cat-name-${subject.id}" placeholder="Categoría (Ej: Seguimiento)" style="width: 60%;">
                    <input type="number" id="cat-perc-${subject.id}" placeholder="Peso %" style="width: 30%;">
                    <button class="btn-primary btn-small" onclick="addCategory(${subject.id})">
                        <i class="fas fa-folder-plus"></i> Añadir Categoría
                    </button>
                </div>
            `;

            subjectsContainer.appendChild(card);
        });
    }

    // --- ACCIONES DE DATOS ---
    addSubjectBtn.addEventListener('click', () => {
        const name = subjectNameInput.value.trim();
        if (!name) return alert('Escribe el nombre de la materia');
        subjects.push({ id: Date.now(), name, categories: [] });
        subjectNameInput.value = '';
        save();
    });

    window.addCategory = function(subId) {
        const nameInp = document.getElementById(`cat-name-${subId}`);
        const percInp = document.getElementById(`cat-perc-${subId}`);
        const name = nameInp.value.trim();
        const percentage = parseFloat(percInp.value);

        if (!name || isNaN(percentage)) return alert('Completa nombre y porcentaje');

        const sub = subjects.find(s => s.id === subId);
        sub.categories.push({ name, percentage, grades: [] });
        save();
    };

    window.addGrade = function(subId, catIdx) {
        const valInp = document.getElementById(`val-${subId}-${catIdx}`);
        const val = parseFloat(valInp.value);

        if (isNaN(val)) return alert('Ingresa una nota válida');

        const sub = subjects.find(s => s.id === subId);
        sub.categories[catIdx].grades.push(val);
        save();
    };

    window.deleteGrade = function(subId, catIdx, gIdx) {
        const sub = subjects.find(s => s.id === subId);
        sub.categories[catIdx].grades.splice(gIdx, 1);
        save();
    };

    window.deleteCategory = function(subId, catIdx) {
        const sub = subjects.find(s => s.id === subId);
        sub.categories.splice(catIdx, 1);
        save();
    };

    window.deleteSubject = function(subId) {
        subjects = subjects.filter(s => s.id !== subId);
        save();
    };

    function getScoreColor(val) {
        if (val >= 3.5) return 'bg-success';
        if (val >= 3.0) return 'bg-warning';
        return 'bg-danger';
    }

    // --- PROCESAMIENTO DE IMÁGENES CON TESSERACT.JS (OCR) ---
    processOcrBtn.addEventListener('click', async () => {
        const file = ocrInput.files[0];
        if (!file) return alert('Por favor selecciona una imagen primero.');

        ocrStatus.innerText = 'Analizando imagen con IA... Espere un momento.';
        ocrResults.innerHTML = '';

        try {
            // Tesseract lee la imagen directamente en el navegador
            const result = await Tesseract.recognize(file, 'spa');
            const text = result.data.text;

            // Filtramos el texto usando Expresiones Regulares para extraer números/notas
            const numberRegex = /\b[0-5](\.\d{1,2})?\b/g; 
            const matches = text.match(numberRegex);

            if (matches && matches.length > 0) {
                ocrStatus.innerText = `¡Éxito! Se detectaron ${matches.length} notas en la imagen:`;
                matches.forEach(num => {
                    const badge = document.createElement('span');
                    badge.className = 'detected-badge';
                    badge.innerText = `Nota: ${num}`;
                    ocrResults.appendChild(badge);
                });
            } else {
                ocrStatus.innerText = 'No se detectaron calificaciones claras (números entre 0.0 y 5.0).';
            }

        } catch (err) {
            console.error(err);
            ocrStatus.innerText = 'Error al procesar la imagen.';
        }
    });

    render();
});