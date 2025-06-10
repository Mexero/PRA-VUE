<script setup>
const props = defineProps([
    'habilidadesSeleccionadas',
    'habilidades'
]);
</script>



<template>
    <div class="field" v-for="(hab, index) in habilidadesSeleccionadas" :key="hab" draggable="true"
        @dragstart="dragStart(index)" @dragover.prevent @drop="drop(index)"
        style="border: 1px solid #ccc; margin-bottom: 8px; padding: 8px; cursor: move;">
        <label>{{ hab }} Base</label>
        <input type="number" v-model.number="ficha.habilidades[hab].base" @input="actualizarTotal(hab)" />
        <label>{{ hab }} Bono</label>
        <select v-model.number="ficha.habilidades[hab].gradoBono" @change="actualizarTotal(hab)">
            <option v-for="n in 5" :key="n - 1" :value="n - 1">
                {{ n - 1 }}
            </option>
        </select>
        <label>{{ hab }} Total</label>
        <input type="number" :value="habilidades[hab].total" readonly tabindex="-1"
            style="background:#eee; border:none;" />
        <button @click="quitarHabilidad(hab)">Quitar</button>
    </div>
</template>