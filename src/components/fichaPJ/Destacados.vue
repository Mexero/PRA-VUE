<template>
    <div class="central">
        <section class="destacados">
            <div class="item">
                <label>bh: <input type="checkbox" v-model="ficha.manual.bh" /></label>
                <input type="number" v-model.number="ficha.derivados.bh" :readonly="!ficha.manual.bh" />
            </div>
            <div class="item">CA: <input v-model.number="ficha.derivados.ca" /></div>
            <div class="item"><label>INIT: <input type="checkbox" v-model="ficha.manual.init" /></label>
                <input v-model.number="ficha.derivados.init" :readonly="!ficha.manual.init" />
                <select v-model="ficha.personaliz.initGrado">
                    <option value="no">N</option>
                    <option value="bueno">E</option>
                    <option value="experto">B</option>
                    <option value="maestro">M</option>
                    <option value="legendario">L</option>
                </select>
            </div>
            <div class="item"> <label>VIT: <input type="checkbox" v-model="ficha.manual.vit" /></label>
                <input v-model.number="ficha.derivados.vit" :readonly="!ficha.manual.vit" />

            </div>
        </section>

        <section class="info-dinamica">
            <div class="item"> <label>PV: <input type="checkbox" v-model="ficha.manual.pvMax" /></label>
                <div><input v-model.number="ficha.derivados.pv" /> /
                    <input v-model.number="ficha.derivados.pvMax" :readonly="!ficha.manual.pvMax" />
                </div>
            </div>
            <div class="item">Escudo: <div><input v-model.number="ficha.escudo" /></div>
            </div>
            <div class="item"> <label>PP: <input type="checkbox" v-model="ficha.manual.ppMax" /></label>
                <div><input v-model.number="ficha.derivados.pp" /> /
                    <input v-model.number="ficha.derivados.ppMax" :readonly="!ficha.manual.ppMax" />
                </div>
            </div>
            <div class="item">Fatiga: <div><input type="number" v-model.number="ficha.derivados.fatiga" /></div>
            </div>
        </section>
    </div>
</template>

<script setup>
defineProps(['ficha'])

</script>

<style scoped>
.central {
    display: flex;
    gap: 40px;

}

.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.info-dinamica,
.destacados {
    display: grid;
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
    gap: 12px;
    flex-grow: 1;
}

.info-dinamica div,
.destacados div {
    align-self: center;
    justify-self: center;
}

.info-dinamica .item div {
    display: flex;
    flex-direction: row;
}

.info-dinamica .item div input {
    width: 25px;
}

.central {
    display: flex;
    justify-content: space-evenly;
}
</style>
