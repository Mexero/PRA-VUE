<template>
    <section class="speeds">
        <div class="bloqueSpeeds">
            <h3>Velocidades</h3>
            <div class="speeds-list">
                <div class="item" v-for="(val, tipo) in ficha.derivados.velocidades" :key="tipo">
                    {{ tipo }}: <input type="number" v-model.number="ficha.derivados.velocidades[tipo]" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.bloqueSpeeds {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    height: fit-content;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}

.speeds h3 {
    text-align: center;
}

input {
    font-size: large;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
    width: 30px;
    text-align: center;
}

/* Quitar flechas en input[type="number"] para Chrome, Safari, Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Quitar flechas en input[type="number"] para Firefox y estándar */
input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.item {
    min-width: 130px;
}
</style>
