<template>
    <section class="speeds">
        <h3>Velocidades</h3>

        <div class="bloqueSpeeds">
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
.speeds {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    padding: 8px;

}

h3 {
    font-size: 18px;
    text-align: center;
    letter-spacing: 1px;
}

.item {
    font-size: 16px;
}

input {
    font-size: 18px;
    background-color: transparent;
    padding: 5px 0 4px 0;
    border: none;
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



@media screen and (max-width: 750px) {
    .speeds {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .speeds-list {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0 20px;
    }

    h3 {
        font-size: 20px;
    }

    .item {
    font-size: 20px;
}

input {
    font-size: 20px;
    background-color: transparent;
    padding: 5px 0 4px 0;
    border: none;
    color: var(--color-texto);
    width: 30px;
    text-align: center;
}
}
</style>
