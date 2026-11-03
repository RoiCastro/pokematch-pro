// 1. Constantes y Variables de Estado
const TOTAL_PAIRS = 151;
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

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
 * Hace una petición a la PokéAPI y devuelve el JSON.
 * Centraliza el control de errores para no repetirlo en cada función.
 * @param {string} url - URL a consultar
 * @returns {Promise<Object>} Datos en formato JSON
 */
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} en ${url}`);
    }
    return response.json();
}
 
/**
 * Recibe una URL de la PokéAPI y devuelve el id del Pokémon.
 * Ej: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 * @param {string} url - URL del Pokémon
 * @returns {number|null} Id del Pokémon o null si la URL no es válida
 */
function getPokemonIdFromUrl(url) {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
}
 
/**
 * Busca los X primeros Pokémon de la PokéAPI y devuelve sus URLs.
 * @param {number} cantidad - Número de Pokémon a recuperar
 * @returns {Promise<string[]>} Array de URLs (vacío si hay error)
 */
async function getFirstPokemonUrls(cantidad) {
    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}?limit=${cantidad}&offset=0`);
        return data.results.map((pokemon) => pokemon.url);
    } catch (error) {
        console.error("No se pudo recuperar el listado de Pokémon:", error);
        return [];
    }
}
 
/**
 * Recibe un id y devuelve el Pokémon con su imagen.
 * @param {number} id - Id del Pokémon
 * @returns {Promise<{id: number, name: string, image: string}|null>}
 */
async function pokemonData(id) {
    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}/${id}`);
        return {
            id: data.id,
            name: data.name,
            // Usamos el sprite normal; si no existe, el shiny como respaldo
            image: data.sprites.front_shiny ?? data.sprites.front_default,
        };
    } catch (error) {
        console.error(`No se pudo recuperar el Pokémon ${id}:`, error);
        return null;
    }
}
 
/**
 * Combina las tres funciones: URLs -> ids -> datos de cada Pokémon.
 * @param {number} cantidad - Número de Pokémon
 * @returns {Promise<Array>} Array de Pokémon válidos
 */
async function getFirstPokemon(cantidad) {
    const urls = await getFirstPokemonUrls(cantidad);
    const ids = urls.map(getPokemonIdFromUrl).filter((id) => id !== null);
    const pokemons = await Promise.all(ids.map(pokemonData));
    return pokemons.filter((pokemon) => pokemon !== null);
}
 
/**
 * Crea la tarjeta HTML de un Pokémon (nombre + imagen).
 * @param {{name: string, image: string}} pokemon
 * @returns {HTMLElement}
 */
function createPokemonCard(pokemon) {
    const card = document.createElement("article");
 
    const img = document.createElement("img");
    img.src = pokemon.image;
    img.alt = `Imagen de ${pokemon.name}`;
 
    const nombre = document.createElement("p");
    nombre.textContent = pokemon.name;
 
    card.append(img, nombre);
    return card;
}
 
// ---------------------- TEST ----------------------//
/**
 * Test: muestra el nombre y la imagen de los X primeros Pokémon
 * por consola y en el #game-board.
 */
async function testPokemon(cantidad = TOTAL_PAIRS) {
    console.log(`[PokéMatch Pro] Cargando los ${cantidad} primeros Pokémon...`);
 
    const pokemons = await getFirstPokemon(cantidad);
    if (pokemons.length === 0) {
        console.error("No se pudo obtener ningún Pokémon.");
        return;
    }
 
    console.table(pokemons.map(({ name, image }) => ({ nombre: name, imagen: image })));
 
    const gameBoard = document.getElementById("game-board");
    if (!gameBoard) return;
 
    gameBoard.innerHTML = "";
    gameBoard.append(...pokemons.map(createPokemonCard));
}
 
testPokemon();
 
