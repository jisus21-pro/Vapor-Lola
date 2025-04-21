let speechInstance = null;
let idiomaActual = "es"; // Idioma por defecto
let speaking = false; // Indicador de si se está hablando

document.addEventListener("DOMContentLoaded", function () {
  let idioma = localStorage.getItem("idioma") || "es";
  cambiarIdioma(idioma);
});

function cambiarIdioma(idioma) {
  idiomaActual = idioma; // Guarda el idioma seleccionado
  localStorage.setItem("idioma", idioma); // Guarda el idioma en el almacenamiento local
  console.log("Idioma cambiado a:", idiomaActual);

  // Cambiar el texto según el idioma
  document.querySelectorAll("[data-es]").forEach((el) => {
    el.innerText =
      idioma === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en");
  });
}

function leerTexto(id) {
  if (speaking) {
    window.speechSynthesis.cancel(); // Cancela la voz si está hablando
    speaking = false; // Indicamos que no se está hablando
    return; // Salimos de la función para no volver a iniciar la lectura
  }

  let texto = document.getElementById(id).innerText;
  let frases = texto.match(/[^.!?]+[.!?]+/g) || [texto]; // Divide el texto en frases

  let i = 0;

  function hablar() {
    if (i < frases.length) {
      speechInstance = new SpeechSynthesisUtterance(frases[i]);
      speechInstance.lang = idiomaActual; // Usa el idioma actual
      speechInstance.onend = () => {
        i++;
        hablar(); // Lee la siguiente frase
      };

      speechInstance.onstart = () => {
        speaking = true; // Indicamos que se está hablando
      };

      window.speechSynthesis.speak(speechInstance);
    } else {
      speaking = false; // Ya no está hablando, reiniciamos el estado
      speechInstance = null;
    }
  }

  hablar(); // Comienza a leer el texto
}
