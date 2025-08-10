
<template>
	<div class="toolbar">
        <div class="selectPokemon">
		<select :value="fichaSeleccionada" @change="$emit('update:fichaSeleccionada', $event.target.value)">
			<option v-for="key in ordenFichas" :key="key" :value="key">{{ key }}</option>
		</select>

        
	<!--	<button @click="$emit('moverFicha', 'principio')">▲▲</button> -->
		<button @click="$emit('moverFicha', -1)">▲</button>
		<button @click="$emit('moverFicha', 1)">▼</button>
	<!--	<button @click="$emit('moverFicha', 'final')">▼▼</button>  -->

        </div>
		<input
			:value="nuevaFichaNombre"
			@input="$emit('update:nuevaFichaNombre', $event.target.value)"
			placeholder="Nombre nueva ficha"
		/>

		<button @click="$emit('crear')">Crear</button>
		<button @click="$emit('borrar')">Borrar</button>
		<button @click="$emit('exportar')">Exportar</button>
		<input type="file" accept="application/json" @change="$emit('importar', $event)" />
	</div>
</template>

<script setup>
defineProps({
	fichaSeleccionada: String,
	nuevaFichaNombre: String,
	ordenFichas: Array
})

defineEmits([
	'crear',
	'borrar',
	'exportar',
	'importar',
	'update:fichaSeleccionada',
	'update:nuevaFichaNombre',
	'moverFicha',
])
</script>

<style scoped>
.toolbar {
	background-color: var(--color-fondoTexto);
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
	align-items: center;
	width: 200px;
	height: fit-content;
	border-radius: 5px;
	padding: 10px;
    margin-top: 60px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 0px 5px rgba(0, 0, 0, 0.2);

}

.toolbar select,
.toolbar input[type="text"],
.toolbar input[type="file"] {
	width: 100%;
	margin-bottom: 4px;
	border-radius: 3px;
	border: 1px solid #ccc;
	padding: 4px 6px;
	font-size: 1em;
	background: var(--color-fondo);
	color: var(--color-texto);
}

.toolbar button {
	width: 100%;
	border: none;
	border-radius: 3px;
	background-color: var(--color-principal1);
color: var(--color-texto);	padding: 6px 0;
	margin-bottom: 4px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.2s;
}
.toolbar button:hover {
	background: var(--color-secundario);
}

.toolbar input[type="file"] {
	padding: 0;
	border: none;
	background: none;
	color: var(--color-texto);
}

.selectPokemon{
    width: 100%;
    display: flex;
    gap: 5px;
}
.selectPokemon button{
    width: fit-content;
}
</style>
