<template>
    <div class="search-container">
        <label>Naturalmente hábil:
            <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
                <option value="">Elige una Habilidad</option>
                <option v-for="check in ChecksBase" :value="check">{{ check }}</option>
            </select>
        </label>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: [String, null],
        required: true
    }
})

defineEmits(['update:modelValue'])

const ChecksBase = [
    'Acrobacias',
    'Actuación',
    'Atletismo',
    'Combate',
    'Empatía',
    'Engaño',
    'Intimidación',
    'Investigación',
    'Juego de Manos',
    'Percepción',
    'Persuasión',
    'Supervivencia',
    'Trato Pokémon',
    'Conocimiento'
]
</script>


<style scoped>
.search-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 6px;
}

label {
    font-weight: 600;
    font-size: 0.95em;
    color: var(--color-texto);
}

select {
    width: 100%;
    padding: 10px 14px;
    border: 1.8px solid #ccc;
    border-radius: 8px;
    font-size: 0.95em;
    background-color: var(--color-fondoTarjeta);
    transition: all 0.25s ease;
}

select:hover {
    border-color: #999;
}

select:focus {
    border-color: #444;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}
</style>