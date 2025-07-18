<template>
    <div class="search-container">
        <span>Tamaño: </span>
        <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
            <option value="">Elige un tamaño</option>
            <option value="Enano">Enano</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
            <option value="Enorme">Enorme</option>
            <option value="Colosal">Colosal</option>
        </select>
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