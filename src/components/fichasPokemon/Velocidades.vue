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
    border-radius: 5px;
    padding: 5px;
}



h3 {
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

@media screen and (max-width: 920px) {
    .speeds {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }


    .speeds-list {
        display: grid;
        grid-template-columns: auto auto auto;
        gap: 0 20px;
    }
}
</style>
