let pokemon;

// Fetch dati JSON dei Pokèmon e genera card le card
fetch("./pokemon.json-master/pokedex.json")
  .then((response) => response.json())
  .then((data) => {
    pokemon = data.slice(0, 151);
    console.log(pokemon);
    generaCards(pokemon);
  })
  .catch((err) => console.log("errore nel caricamento", err));

// Ricerca dinamica
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", (e) => {
  const valore = e.target.value.toLowerCase();
  const pokemonFiltrati = pokemon.filter((pkm) => {
    return pkm.name.english.toLowerCase().startsWith(valore);
  });
  generaCards(pokemonFiltrati);
});

// Funzione che genera le card
function generaCards(listaPokemon) {
  const pokedex = document.getElementById("pokedex");
  pokedex.innerHTML = "";

  // Per ogni Pokemon della lista genera immagine, nome, tipo e statistiche
  listaPokemon.forEach((pokemon) => {
    const tipi = pokemon.type.join(" / ");

    const stats = Object.entries(pokemon.base)
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
        <img src="pokemon.json-master/images/${formatID(pokemon.id)}.png" alt="${pokemon.name.english}">
        <h3>${pokemon.name.english}</h3>

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

  aggiungiEventiCard();
}

// Collega le card al click
function aggiungiEventiCard() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => toggleCard(card));
  });
}

// Mostra o nasconde la card cliccata
function toggleCard(cardCliccata) {
  document.querySelectorAll(".card.expanded").forEach((card) => {
    if (card !== cardCliccata) {
      card.classList.remove("expanded");
    }
  });

  // Apre o chiude la card cliccata
  cardCliccata.classList.toggle("expanded");
}

// Formatta l'ID in 3 cifre
function formatID(id) {
  if (id.toString().length == 1) return `00${id}`;
  if (id.toString().length == 2) return `0${id}`;
  return id;
}
