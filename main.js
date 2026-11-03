// 1. Constantes y Variables de Estado
const TOTAL_PAIRS = 6;

let moves = 0;
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

// 2. Selección de elementos del DOM
const movesElement = document.getElementById("moves-count");
const pairsElement = document.getElementById("pairs-count");

function updateBoardUI() {
    if (movesElement) movesElement.textContent = moves;
    if (pairsElement)
        pairsElement.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
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
//startConsoleTimer();

// Array base con 6 parejas de Pokémon (12 elementos en total)
const pokemonList = [
    "pikachu",
    "pikachu",
    "charmander",
    "charmander",
    "bulbasaur",
    "bulbasaur",
    "squirtle",
    "squirtle",
    "jigglypuff",
    "jigglypuff",
    "snorlax",
    "snorlax",
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

//
const shuffledPokemon = shuffleCards(pokemonList);
// DE AQUI PARA ABAJO SE PUEDE MODIFICAR
/**
 * Obtiene los datos de un Pokémon desde la PokéAPI
 * @param {string|number} pokemonId - Nombre o ID del Pokémon
 * @returns {Object|null} Objeto con el nombre y la URL del sprite o null si hay error
 */
async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        return {
            name: data.name,
            image: data.sprites.front_shiny,
        };
    } catch (error) {
        console.error("No se pudo recuperar el Pokémon:", error);
        return null;
    }
}

async function fetchAllPokemonData(pokemonArray) {
    const promises = pokemonArray.map((pokemon) => fetchPokemonData(pokemon));
    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
}

async function testApiConnection() {
  console.log("[PokéMatch Pro] Consultando la PokéAPI...");
  const pokemon = await fetchAllPokemonData(pokemonList);
  if (pokemon) {
    console.log("Pokémon obtenido con éxito:", pokemon);
  }
}


/**
 * Obtiene un listado de Pokémon desde la PokéAPI
 * @param {number} limit - Cantidad de Pokémon a recuperar
 * @param {number} offset - Desde qué posición empezar
 * @returns {Array|null} Array de { name, url } o null si hay error
 */
async function pokeapiData(limit = 20, offset = 0) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        return data.results.map((pokemon) => ({
            name: pokemon.name,
            url: pokemon.url,
        }));
    } catch (error) {
        console.error("No se pudo recuperar el listado de Pokémon:", error);
        return null;
    }
}

// Prueba de carga pokeApi
async function testPokeApiConnection() {
    console.log("[PokéMatch Pro] Consultando el listado de la PokéAPI...");
    const pokemonList = await pokeapiData(6);
    if (!pokemonList || pokemonList.length === 0) {
        console.error("No se pudo obtener ningún Pokémon.");
        return;
    }

    console.log("Listado obtenido con éxito:", pokemonList);
    const gameBoard = document.getElementById("game-board");
    if (!gameBoard) return;

    gameBoard.innerHTML = `<h2>PokéMatch Pro</h2>`;
    
    for (const pokemon of pokemonList) {
        const nombre = document.createElement("p");
        nombre.textContent = `Nombre: ${pokemon.name}`;

        const url = document.createElement("p");
        url.textContent = `URL: ${pokemon.url}`;

        const pokemonData = await fetchPokemonData(pokemon.name);
        gameBoard.append(nombre, url);

        if (pokemonData?.image) {
            const img = document.createElement("img");
            img.src = pokemonData.image;
            img.alt = `Imagen de ${pokemon.name}`;
            gameBoard.append(img);
        }
    }
}


testPokeApiConnection();