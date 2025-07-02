<template>
    <div class="toolbar">
        <select :value="fichaSeleccionada" @change="$emit('update:fichaSeleccionada', $event.target.value)">
            <option v-for="key in ordenFichas" :key="key" :value="key">{{ key }}</option>
        </select>
        <button @click="$emit('moverFicha', 'principio')">▲▲</button>
        <button @click="$emit('moverFicha', -1)">▲</button>
        <button @click="$emit('moverFicha', 1)">▼</button>
        <button @click="$emit('moverFicha', 'final')">▼▼</button>

        <input :value="nuevaFichaNombre" @input="$emit('update:nuevaFichaNombre', $event.target.value)"
            placeholder="Nombre nueva ficha" />

        <button @click="$emit('crear')">Crear</button>
        <button @click="$emit('borrar')">Borrar</button>
        <button @click="$emit('exportar')">Exportar</button>

        <input type="file" accept="application/json" @change="$emit('importar', $event)" />
    </div>
</template>

<script setup>
defineProps({
    fichaSeleccionada: String,
    nuevaFichaNombre: String,
    fichasGuardadas: Object,
    ordenFichas: Array
})

defineEmits([
    'crear',
    'borrar',
    'exportar',
    'importar',
    'update:fichaSeleccionada',
    'update:nuevaFichaNombre',
    'moverFicha',
])
</script>

<style scoped>
.toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
}
</style>
