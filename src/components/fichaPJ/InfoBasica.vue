<template>
    <section class="info-basica">
        <div>
            <span class="label">Nombre:</span>
            <input v-model="ficha.nombre" @keyup.enter="emit('cambiarNombre', ficha.nombre)" />
        </div>

        <div>
            <span class="label">Especie:</span>
            <input v-model="ficha.pokedex.especie" />
        </div>

        <div>
            <span class="label">Nivel:</span>
            <input type="number" v-model.number="nivelTemp" min="0" />
            <button @click="cambiarNivel">Cambiar</button>
        </div>

        <div>
            <span class="label">Tipos:</span>
            <input v-model="ficha.pokedex.tipos[0]" placeholder="Tipo 1" /> /
            <input v-model="ficha.pokedex.tipos[1]" placeholder="Tipo 2" />
        </div>
    </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['ficha'])
const emit = defineEmits(['cambiarNombre'])

const nivelTemp = ref(props.ficha.nivel)

// Si ficha.nivel cambia desde fuera, lo actualizamos también localmente
watch(
    () => props.ficha.nivel,
    (nuevo) => {
        nivelTemp.value = nuevo
    }
)

function cambiarNivel() {
    props.ficha.nivel = nivelTemp.value
}
</script>

<style scoped>
.info-basica {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.label {
    font-weight: 600;
    color: #34495e;
}

button {
    margin-left: 8px;
    padding: 4px 10px;
    font-size: 0.9em;
}
</style>