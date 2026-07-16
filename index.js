// Array vuoto che conterrà la lista Pokèmon caricata dal JSON.
let pokemon = [];

// Seleziono gli elementi del DOM tramite ID.
const searchBar = document.getElementById("search-bar");
const pokedex = document.getElementById("pokedex");

// Fetch dati JSON dei Pokèmon, se la risposta va a buon fine vengono generate le card.
fetch("./pokemon.json-master/pokedex.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Utilizzo slice() per mostrare la lista dei Pokèmon fino al numero 151 (prima generazione).
    pokemon = data.slice(0, 151);
    generaCards(pokemon);
  })
  .catch((err) => {
    console.error("Errore nel caricamento dei Pokèmon", err);
    pokedex.innerHTML =
      "<p>Problema nel caricamento dei Pokèmon, riprova più tardi.</p>";
  });

// Ricerca dinamica con leggero timeout
// Apetta che l'utente smetta di scrivere prima di rifare il filtro e eseguire la ricerca.
let timeoutSearch;

searchBar.addEventListener("input", (e) => {
  clearTimeout(timeoutSearch);

  timeoutSearch = setTimeout(() => {
    const valore = e.target.value.toLowerCase();
    const pokemonFiltrati = pokemon.filter((pkm) => {
      return pkm.name.english.toLowerCase().startsWith(valore);
    });

    generaCards(pokemonFiltrati);
  }, 200); //200ms di attesa dopo l'ultimo tasto premuto.
});

// Funzione che genera le card
function generaCards(listaPokemon) {
  pokedex.innerHTML = "";

  // Per ogni Pokemon della lista genera immagine, nome, tipo e statistiche
  listaPokemon.forEach((pkm) => {
    const tipi = pkm.type.join(" / ");

    const stats = Object.entries(pkm.base)
      .map(
        ([stat, value]) => `
        <li>
          <span>${stat}</span>
          <span>${value}</span>
        </li>
      `,
      )
      .join("");

    const card = `
      <div class="card" tabindex="0">
        <img src="pokemon.json-master/images/${formatID(pkm.id)}.png" alt="${pkm.name.english}">
        <h3>${pkm.name.english}</h3>

        <div class="extra">
          <p class="types">${tipi}</p>
          <ul class="stats">
            ${stats}
          </ul>
        </div>
      </div>
    `;

    pokedex.insertAdjacentHTML("beforeend", card);
  });

  // Ogni volta che le card vengono rigenerate si ricollega l'evento 'click'.
  aggiungiEventiCard();
}

// Collega le card al click.
function aggiungiEventiCard() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => toggleCard(card));
  });
}

// Mostra o nasconde la card cliccata.
function toggleCard(cardCliccata) {
  // Chiude tutte le card espanse, tranne quella cliccata.
  document.querySelectorAll(".card.expanded").forEach((card) => {
    if (card !== cardCliccata) {
      card.classList.remove("expanded");
    }
  });

  // Apre o chiude la card cliccata.
  cardCliccata.classList.toggle("expanded");
}

// Formatta l'ID in 3 cifre
// Necessario perchè i file delle immagini richiedono ID formattato come stringa con zeri iniziali (001, 002 ecc.)
// Usando l'ID numerico del file JSON le immagini non vengono trovate.
function formatID(id) {
  return id.toString().padStart(3, "0");
}
