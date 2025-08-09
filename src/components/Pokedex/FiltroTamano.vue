<template>
    <div class="search-container">
        <label>Tamaño:
            <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
                <option value="">Elige un tamaño</option>
                <option value="Enano">Enano</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
                <option value="Enorme">Enorme</option>
                <option value="Colosal">Colosal</option>
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