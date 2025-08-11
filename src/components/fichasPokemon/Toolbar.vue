<template>
	<div class="toolbar">
		<div class="dropdown-container">
			<button :class="['toggle', { open: dropdownOpen }]" @click="toggleDropdown" type="button">
				Fichas
				<span :class="['triangle', { open: dropdownOpen }]">▶</span>
			</button>
			<div v-if="dropdownOpen" class="dropdown-content">
				<div class="selectPokemon">
					<draggable v-model="localOrdenFichas" @end="onReorder" item-key="key" :animation="200"
						class="draggable-list">
						<template #item="{ element: ficha }">
							<button :class="{ selected: ficha === fichaSeleccionada }" @click="selectFicha(ficha)"
								class="ficha-item" type="button">
								{{ ficha }}
							</button>
						</template>
					</draggable>
				</div>
			</div>
		</div>

		<button @click="$emit('crear')">Crear ficha</button>
		<button @click="$emit('borrar')">Borrar ficha</button>
		<button @click="$emit('exportar')">Exportar ficha</button>
		<!-- input file oculto -->
		<input ref="fileInput" type="file" accept="application/json" @change="$emit('importar', $event)"
			style="display: none;" />
		<!-- botón que dispara el input file -->
		<button @click="triggerFileInput" type="button">Importar ficha</button>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
	fichaSeleccionada: String,
	ordenFichas: Array
});

const emit = defineEmits([
	'crear',
	'borrar',
	'exportar',
	'importar',
	'update:fichaSeleccionada',
	'update:ordenFichas'
]);

const localOrdenFichas = ref([...props.ordenFichas]);
const dropdownOpen = ref(false);
const fileInput = ref(null);

watch(() => props.ordenFichas, (newVal) => {
	localOrdenFichas.value = [...newVal];
}, { deep: true });

function onReorder() {
	emit('update:ordenFichas', [...localOrdenFichas.value]);
}

function selectFicha(ficha) {
	emit('update:fichaSeleccionada', ficha);
	dropdownOpen.value = false;
}

function toggleDropdown() {
	dropdownOpen.value = !dropdownOpen.value;
}

function onClickOutside(event) {
	if (!event.target.closest('.dropdown-container')) {
		dropdownOpen.value = false;
	}
}

function triggerFileInput() {
	fileInput.value.click();
}

onMounted(() => {
	document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', onClickOutside);
});
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
.toolbar input[type='text'],
.toolbar input[type='file'] {
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
	color: var(--color-texto);
	padding: 6px 0;
	margin-bottom: 4px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.2s;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.toolbar button:hover {
	background: var(--color-secundario);
}

.toolbar input[type='file'] {
	padding: 0;
	border: none;
	background: none;
	color: var(--color-texto);
}

.selectPokemon {
	width: 100%;
	display: flex;
	gap: 5px;
	flex-wrap: wrap;
}

.draggable-list {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	width: 85%;
}

.dropdown-container {
	position: relative;
	width: 100%;
}

.dropdown-toggle {
	width: 100%;
	border: none;
	border-radius: 3px;
	background-color: var(--color-principal1);
	color: var(--color-texto);
	padding: 6px 0;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.2s;
	text-align: left;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dropdown-toggle:hover {
	background: var(--color-secundario);
}

.triangle {
	display: inline-block;
	transition: transform 0.3s ease;
	margin-right: 8px;
	user-select: none;
}

.triangle.open {
	transform: rotate(90deg);
}

.toggle.open {
	background-color: var(--color-secundario);
}

.selected {
	background-color: var(--color-secundario) !important;
}
</style>
