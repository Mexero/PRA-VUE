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
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
}

select {
    width: 100%;
    max-width: 400px;
    padding: 12px 20px;
    border: 2px solid #ddd;
    border-radius: 25px;
    font-size: 1em;
    transition: all 0.3s ease;
    outline: none;
}

select:focus {
    border-color: #6890f0;
    box-shadow: 0 0 5px rgba(104, 144, 240, 0.3);
}
</style>