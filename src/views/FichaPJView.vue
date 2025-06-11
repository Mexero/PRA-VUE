<template>
    <div class="character-sheet container">
        <FichaToolbar :fichaSeleccionada="fichaSeleccionada" :nuevaFichaNombre="nuevaFichaNombre"
            :fichasGuardadas="fichasGuardadas" @update:fichaSeleccionada="fichaSeleccionada = $event"
            @update:nuevaFichaNombre="nuevaFichaNombre = $event" @crear="crearFicha" @borrar="borrarFicha"
            @exportar="exportarFicha" @importar="importarFicha" />

        <FichaInfoBasica :ficha="ficha" />
        <FichaStats :ficha="ficha" @cambiar-mejora="cambiarMejoraEST" />

        <div class="info-principal">
            <FichaChecks :ficha="ficha" :ChecksBase="ChecksBase" @actualizar-check="updateCheck"
                @eliminar-check="removeCheck" @anadir-check="addCheck" />
            <FichaDestacados :ficha="ficha" @actualizar="actualizar" />
            <FichaInfoDinamica :ficha="ficha" />
            <FichaVelocidades :ficha="ficha" />
        </div>

        <FichaMovimientos :ficha="ficha" />
        <FichaHabilidades :ficha="ficha" />
        <FichaDotes :ficha="ficha" />
        <FichaOtros :ficha="ficha" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

import FichaToolbar from '@/components/fichaPJ/Toolbar.vue'
import FichaInfoBasica from '@/components/fichaPJ/InfoBasica.vue'
import FichaStats from '@/components/fichaPJ/Stats.vue'
import FichaChecks from '@/components/fichaPJ/Checks.vue'
import FichaDestacados from '@/components/fichaPJ/Destacados.vue'
import FichaInfoDinamica from '@/components/fichaPJ/InfoDinamica.vue'
import FichaVelocidades from '@/components/fichaPJ/Velocidades.vue'
import FichaMovimientos from '@/components/fichaPJ/Movimientos.vue'
import FichaHabilidades from '@/components/fichaPJ/Habilidades.vue'
import FichaDotes from '@/components/fichaPJ/Dotes.vue'
import FichaOtros from '@/components/fichaPJ/Otros.vue'

import { crearFichaBase } from '@/utils/TemplateFicha.js'

const ficha = reactive(crearFichaBase())
const fichaSeleccionada = ref('')
const nuevaFichaNombre = ref('')
const fichasGuardadas = reactive({})

const ChecksBase = [
    'Acrobacias', 'Actuación', 'Atletismo', 'Combate', 'Empatía', 'Engaño',
    'Intimidación', 'Investigación', 'Juego de Manos', 'Percepción',
    'Persuasión', 'Supervivencia', 'Trato Pokémon'
]
const grados = {
    no: 0,
    bueno: () => ficha.derivados.bh,
    experto: () => ficha.derivados.bh + 2,
    maestro: () => ficha.derivados.bh + 4,
    legendario: () => ficha.derivados.bh + 6
}

function updateCheck(check) {
    const statVal = ficha.stats[check.stat] || 0
    const bonoGrado = typeof grados[check.grado] === 'function' ? grados[check.grado]() : grados[check.grado]
    const nuevoTotal = statVal + bonoGrado
    check.total = nuevoTotal
    check.modificado = false
}



//Añadir checks
function addCheck(nombre) {
    if (!nombre) return
    ficha.checks.push({ nombre, stat: 'fue', grado: 'no', total: 0, modificado: false })
}

function removeCheck(index) {
    ficha.checks.splice(index, 1)
}



//cambiar Mejoras de EST
function cambiarMejoraEST(stat, delta) {
    const mejoras = ficha.personaliz.mejorasEst;
    const max = ficha.derivados.cantidadMejorasEST;

    if (delta > 0) {
        while (delta > 0 && mejoras.length < max) {
            mejoras.push(stat);
            delta--;
        }
    } else if (delta < 0) {
        let eliminadas = 0;
        for (let i = mejoras.length - 1; i >= 0 && eliminadas < -delta; i--) {
            if (mejoras[i] === stat) {
                mejoras.splice(i, 1);
                eliminadas++;
            }
        }
    }
}

//Actualizar datos
function actualizar() {
    const mejoraToValor = (mejoras) => {
        if (mejoras <= 3) return mejoras;
        if (mejoras === 4) return 3;
        return 4;
    };

    // Actualizar estadísticas con mejoras de estadísticas
    for (const stat in ficha.derivados.stats) {
        const baseStat = ficha.pokedex.statsBase[stat] || 0;
        const mejorasAplicadas = ficha.personaliz.mejorasEst.filter(s => s === stat).length;
        ficha.derivados.stats[stat] = baseStat + mejoraToValor(mejorasAplicadas);
    }

    // Actualizar salvaciones con bonificaciones personalizadas
    for (const stat in ficha.derivados.salvaciones) {
        const statTotal = ficha.derivados.stats[stat] || 0;
        const bonificacion = ficha.personaliz.salvaciones[stat] || 0;
        ficha.derivados.salvaciones[stat] = statTotal + bonificacion;
    }

    // Valores derivados automáticos si no están definidos manualmente
    if (!ficha.manual.bh) {
        ficha.derivados.bh = Math.ceil(ficha.nivel / 2);
    }

    if (!ficha.manual.ppMax) {
        ficha.derivados.ppMax = ficha.derivados.stats.esp + ficha.nivel;
    }

    if (!ficha.manual.cantidadMejorasEST) {
        ficha.derivados.cantidadMejorasEST = 1 + Math.floor((ficha.nivel - 2) / 3);
    }

    // Recalcular checks personalizados
    ficha.derivados.checks.forEach(updateCheck);
}


//Manipular fichas

function guardarFicha() {
    if (!fichaSeleccionada.value) return
    fichasGuardadas[fichaSeleccionada.value] = JSON.parse(JSON.stringify({ ficha }))
    localStorage.setItem('fichas_vue', JSON.stringify(fichasGuardadas))
}

function cargarFicha(nombre) {
    const data = fichasGuardadas[nombre]
    if (data) Object.assign(ficha, data.ficha || {})
}

function crearFicha() {
    if (!nuevaFichaNombre.value || fichasGuardadas[nuevaFichaNombre.value]) return
    const nueva = crearFichaBase(nuevaFichaNombre.value)
    fichaSeleccionada.value = nuevaFichaNombre.value
    Object.assign(ficha, JSON.parse(JSON.stringify(nueva)))
    guardarFicha()
    nuevaFichaNombre.value = ''
}

function borrarFicha() {
    if (!fichaSeleccionada.value) return
    delete fichasGuardadas[fichaSeleccionada.value]
    localStorage.setItem('fichas_vue', JSON.stringify(fichasGuardadas))
    fichaSeleccionada.value = ''
    Object.assign(ficha, crearFichaBase())
}

function exportarFicha() {
    const blob = new Blob([JSON.stringify({ ficha }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ficha.nombre || 'ficha'}.json`
    a.click()
    URL.revokeObjectURL(url)
}

function importarFicha(event) {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result)
            if (data.ficha) Object.assign(ficha, data.ficha)
            if (ficha.nombre) {
                fichasGuardadas[ficha.nombre] = JSON.parse(JSON.stringify({ ficha }))
                fichaSeleccionada.value = ficha.nombre
                guardarFicha()
            }
        } catch (err) {
            console.error('Error al importar ficha:', err)
        }
    }
    reader.readAsText(file)
}

onMounted(() => {
    const guardadas = localStorage.getItem('fichas_vue')
    if (guardadas) Object.assign(fichasGuardadas, JSON.parse(guardadas))
    if (Object.keys(fichasGuardadas).length > 0) {
        fichaSeleccionada.value = Object.keys(fichasGuardadas)[0]
        cargarFicha(fichaSeleccionada.value)
    }
})

watch(ficha, () => {
    actualizar()
    guardarFicha()
}, { deep: true })
</script>

<style scoped>
/* inputs */

.item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
}

.item label {
    margin-right: 0.25rem;
}

.item input[type="number"] {
    width: 5rem;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    transition: border-color 0.2s ease-in-out;
}

.item input[type="checkbox"] {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #666;
    background-color: #fff;
    margin-left: auto;
    margin-right: 4px;
    cursor: pointer;
    position: relative;
}

.item input[type="checkbox"]:checked {
    background-color: #444;
    box-shadow: inset 0 0 0 2px #fff;
}

.item span {
    font-size: 0.8rem;
    color: #888;
}




.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
}

/* Básicos */
input {
    width: 50px;
}

.toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
}

.info-basica {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.info-item {
    flex: 1;
    font-size: 1rem;
}

.label {
    font-weight: 600;
    color: #34495e;
}

.value {
    margin-left: 6px;
    color: #555;
}

/* Sección principal */
.principal {
    display: flex;
    gap: 8px;
    height: fit-content;
}

.stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}

/* PRICIPAL GRID */
.info-principal {
    width: 100%;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, 1fr) 150px;
    grid-template-rows: repeat(1, 1fr);
    grid-template-areas:
        "checks destacados dinam vels";
}

/* Grid areas */
.info-dinamica {
    grid-area: dinam;
}

.checks {
    grid-area: checks;
}

.destacados {
    grid-area: destacados;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
}

.destacados div {
    width: 70px;
    height: 70px;
}

.speeds {
    grid-area: vels;
}


/* Secciones con títulos */
section {
    margin-bottom: 20px;
}

section h3 {
    font-size: 1.2rem;
    color: #34495e;
    margin-bottom: 10px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 4px;
}



/* Habilidades y Feats */
.habsFeats {
    display: flex;
    gap: 4%;
}

.habilidades,
.feats {
    width: 48%;
}

/* Grillas generales */
.others-list {
    display: flex;
    gap: 10px;
}

.others-list div {
    width: 18%;
}

.changing-grid {
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
}

.checks-list,
.speeds-list,
.habilidades-list,
.feats-list {
    display: flex;
    gap: 10px;
    flex-direction: column;
}


.others-list {
    grid-template-columns: repeat(4, 1fr);
}

/* Ítems */
.item {
    background: #ecf0f1;
    border-radius: 6px;
    padding: 8px;
    text-align: center;
    color: #2c3e50;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Base stats */
.base-stats {
    display: flex;
    gap: 16px;
    justify-content: space-around;
    margin-bottom: 20px;
}

.base-item {
    background: #d6eaf8;
    color: #21618c;
    font-weight: 700;
}

/* Movimientos */
.moves-grid {
    background: #d5f5e3;
    border-radius: 8px;
    padding: 12px;
    min-height: 80px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    font-weight: 600;
    color: #196f3d;
    text-align: center;
}

.moves-grid div {
    background: #4eb67b;
    border-radius: 8px;
    min-height: 100px;

}
</style>
