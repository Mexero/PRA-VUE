<template>
    <section class="checks">
        <h3>Tiradas de habilidad</h3>
        <div class="checks-list">
            <div class="item" v-for="(check, i) in ficha.checks" :key="i">
                <select v-model="check.stat">
                    <option v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat" :value="stat">
                        {{ stat.toUpperCase() }}
                    </option>
                </select>
                <select v-model="check.grado" @change="$emit('actualizar-check', check)">
                    <option value="no">No entrenado</option>
                    <option value="bueno">Bueno</option>
                    <option value="experto">Experto</option>
                    <option value="maestro">Maestro</option>
                    <option value="legendario">Legendario</option>
                </select>
                <label>Total:</label>
                <input type="number" v-model.number="check.total" />
                <button @click="$emit('eliminar-check', i)">✕</button>
            </div>
            <div class="item">
                <select v-model="nuevaCheck">
                    <option disabled value="">Añadir nueva habilidad</option>
                    <option v-for="op in ChecksBase" :key="op" :value="op">{{ op }}</option>
                </select>
                <button @click="$emit('anadir-check', nuevaCheck); nuevaCheck = ''">Añadir</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
const nuevaCheck = ref('')
defineProps(['ficha', 'ChecksBase'])
defineEmits(['actualizar-check', 'eliminar-check', 'anadir-check'])
</script>

<style scoped>
.checks-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>