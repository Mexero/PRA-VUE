<template>
    <section class="checks">
        <h3>Tiradas de habilidad</h3>
        <div class="checks-list">
            <div class="item" v-for="(check, i) in ficha.derivados.checks" :key="i">
                <p>{{ check.check }}</p>
                <select v-model="check.stat">
                    <option v-for="stat in Object.keys(ficha.derivados.stats)" :key="stat" :value="stat">
                        {{ stat.toUpperCase() }}
                    </option>
                </select>
                <select v-model="check.grado">
                    <option value="no">No entrenado</option>
                    <option value="bueno">Bueno</option>
                    <option value="experto">Experto</option>
                    <option value="maestro">Maestro</option>
                    <option value="legendario">Legendario</option>
                </select>
                <label>Total:</label>
                <input type="number" v-model.number="check.total" />
                <button @click="removeCheck(i)">✕</button>
            </div>
            <div class="item">
                <select v-model="nuevoCheck">
                    <option disabled value="">Añadir nueva habilidad</option>
                    <option v-for="op in ChecksBase" :key="op" :value="op">{{ op }}</option>
                </select>
                <button @click="addCheck">Añadir</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['ficha', 'ChecksBase'])

const nuevoCheck = ref('')

function addCheck() {
    if (!nuevoCheck.value) return

    // Verifica si ya existe
    const yaExiste = props.ficha.derivados.checks.some(c => c.check === nuevoCheck.value)
    if (yaExiste) {
        nuevoCheck.value = ''
        return
    }

    props.ficha.derivados.checks.push({
        check: nuevoCheck.value,
        stat: 'fue',
        grado: 'no',
        total: 0
    })
    nuevoCheck.value = ''
}

function removeCheck(index) {
    props.ficha.derivados.checks.splice(index, 1)
}
</script>

<style scoped>
.checks-list {
    display: grid;
    grid-template: repeat(4, auto) / repeat(2, 1fr);
    gap: 10px;
}

.item {
    display: flex;
    flex-direction: row;
    gap: 4px;
}
</style>