export default {
  mounted(el, binding) {
    // Función que se ejecuta en cada clic del documento
    el.__clickOutsideHandler__ = (event) => {
      // Si el clic fue fuera del elemento actual
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event) // Ejecuta el método pasado a la directiva
      }
    }

    // Escucha el clic en todo el documento
    document.addEventListener('click', el.__clickOutsideHandler__)
  },

  unmounted(el) {
    // Limpia el listener cuando el componente se destruye
    document.removeEventListener('click', el.__clickOutsideHandler__)
    el.__clickOutsideHandler__ = null
  }
}