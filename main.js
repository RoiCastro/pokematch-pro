// 1. Constantes y Variables de Estado
const TOTAL_PAIRS = 6;

let moves = 0;          
let matchedPairs = 0;   
let hasFlippedCard = false; 
let lockBoard = false;      
let firstCard = null;       
let secondCard = null;

// 2. Selección de elementos del DOM
const movesElement = document.getElementById('moves-count');
const pairsElement = document.getElementById('pairs-count');

function updateBoardUI() {
  if (movesElement) movesElement.textContent = moves;
  if (pairsElement) pairsElement.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
}
updateBoardUI();

// 3. Temporizador por Consola
let secondsElapsed = 0;
let timerInterval = null;

function startConsoleTimer() {
  console.log("[PokéMatch Pro] Iniciando temporizador por consola...");
  timerInterval = setInterval(() => {
    secondsElapsed++;
    console.log(`⏱️ Tiempo transcurrido: ${secondsElapsed}s`);
  }, 1000);
}

function stopConsoleTimer() {
  clearInterval(timerInterval);
  console.log(`⏹️ Temporizador detenido a los ${secondsElapsed} segundos.`);
}

// Iniciar prueba
startConsoleTimer();

// Array base con 6 parejas de Pokémon (12 elementos en total)
const pokemonList = [
  'pikachu', 'pikachu',
  'charmander', 'charmander',
  'bulbasaur', 'bulbasaur',
  'squirtle', 'squirtle',
  'jigglypuff', 'jigglypuff',
  'snorlax', 'snorlax'
];

/**
 * Algoritmo de barajado Fisher-Yates
 * @param {Array} array - Array de elementos a desordenar
 * @returns {Array} El mismo array mezclado aleatoriamente
 */
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generar índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Intercambiar elementos usando desestructuración
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log("Array original:", [...pokemonList]);

const shuffledPokemon = shuffleCards(pokemonList);

console.log("Array barajado (Fisher-Yates):", shuffledPokemon);