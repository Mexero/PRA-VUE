<script setup>
import { ref, computed, watch } from 'vue';


const props = defineProps([
    'allowedValues',
    'limpiar'
]);

const allowedValues = props.allowedValues;

const emit = defineEmits(['actualizarMinMax']);


watch(() => props.limpiar, () => {
    minIndex.value = 0;
    maxIndex.value = props.allowedValues.length - 1;
});

const minIndex = ref(0);
const maxIndex = ref(allowedValues.length - 1);

const valorMin = ref(allowedValues[minIndex.value]);
const valorMax = ref(allowedValues[maxIndex.value]);

const sliderStyle = computed(() => {
    const total = allowedValues.length - 1;
    return {
        left: `${(minIndex.value / total) * 100}%`,
        right: `${100 - (maxIndex.value / total) * 100}%`
    };
});

function clampIndex(index) {
    return Math.min(Math.max(index, 0), allowedValues.length - 1);
}

function closestAllowed(val) {
    return allowedValues.reduce((prev, curr) =>
        Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
}

function valueToIndex(val) {
    return allowedValues.indexOf(val);
}

function onSliderInput() {
    if (minIndex.value > maxIndex.value) {
        [minIndex.value, maxIndex.value] = [maxIndex.value, minIndex.value];
    }
    valorMin.value = allowedValues[minIndex.value];
    valorMax.value = allowedValues[maxIndex.value];
    emitirDatos();
}

function onNumberInput() {
    const valMin = closestAllowed(Number(valorMin.value));
    const valMax = closestAllowed(Number(valorMax.value));
    let idxMin = valueToIndex(valMin);
    let idxMax = valueToIndex(valMax);

    if (idxMin > idxMax) {
        [idxMin, idxMax] = [idxMax, idxMin];
    }

    minIndex.value = clampIndex(idxMin);
    maxIndex.value = clampIndex(idxMax);
    valorMin.value = allowedValues[minIndex.value];
    valorMax.value = allowedValues[maxIndex.value];
    emitirDatos();
}

watch([minIndex, maxIndex], () => {
    valorMin.value = allowedValues[minIndex.value];
    valorMax.value = allowedValues[maxIndex.value];
    emitirDatos();
});

watch([valorMin, valorMax], () => {
    emitirDatos();
});

function emitirDatos() {
    emit('actualizarMinMax', valorMin.value, valorMax.value);
}

</script>

<template>
    <div id="filtroCostes">
        <input type="number" :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]" placeholder="$ min"
            class="input-min" v-model.number="valorMin" @input="onNumberInput" />

        <div class="slider">
            <div class="price-slider" :style="sliderStyle"></div>
            <div class="range-input">
                <input type="range" :min="0" :max="allowedValues.length - 1" v-model.number="minIndex"
                    @input="onSliderInput" />
                <input type="range" :min="0" :max="allowedValues.length - 1" v-model.number="maxIndex"
                    @input="onSliderInput" />
            </div>
        </div>

        <input type="number" :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]" placeholder="$ max"
            class="input-max" v-model.number="valorMax" @input="onNumberInput" />
    </div>

</template>


<style scoped>
input[type="number"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}


#filtroCostes {
    display: flex;
    gap: 20px;
    flex-direction: row;
    width: 100%;
}

input[type="number"] {
    width: 83px;
    padding: 3px 0;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    text-align: center;
}

.slider {
    align-self: center;
    height: 8px;
    position: relative;
    background: #e4e4e4;
    border-radius: 5px;
    width: 100%;
}

.slider .price-slider {
    height: 100%;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 5px;
    background: var(--color-principal1);
}

/* Remove Arrows/Spinners */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.range-input input {
    position: absolute;
    width: 100%;
    height: 5px;
    background: none;
    pointer-events: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;

}

/* Styles for the range thumb in WebKit browsers */
input[type="range"]::-webkit-slider-thumb {
    height: 20px;
    width: 20px;
    margin-top: 3px;
    border-radius: 50%;
    background: #555;
    pointer-events: auto;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
}

/* Firefox slider thumb */
.range-input input[type="range"]::-moz-range-thumb {
    height: 20px;
    width: 20px;
    transform: translateY(2px);
    border: none;
    border-radius: 50%;
    background: #555;
    pointer-events: auto;
}

/* Optional: Remove default Firefox styles */
.range-input input[type="range"]::-moz-range-track {
    background: transparent;
}


#filtroCostes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
        "min max"
        "slider slider";
    align-items: center;
    gap: 0 10px;
    margin-bottom: 10px;
}

.input-min {
    grid-area: min;
    justify-self: start;
    width: 80px;
}

.input-max {
    grid-area: max;
    justify-self: end;
    width: 80px;
}

.slider {
    grid-area: slider;
    width: 100%;
    margin-top: 10px;
}
</style>