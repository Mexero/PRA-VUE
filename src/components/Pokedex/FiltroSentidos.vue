<template>
    <div class="search-container">
        <label>Sentido:
            <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
                <option value="">Elige un sentido</option>
                <option value="scuridad">Visión en la Oscuridad</option>
                <option value="lectrorrecep">Electrorrecepción</option>
                <option value="ibración">Sentido de la vibración</option>
                <option value="colocaliza">Ecolocalización</option>
                <option value="spectral">Sentido espectral</option>
                <option value="lma">Sentido del alma</option>
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