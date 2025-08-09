document.addEventListener("DOMContentLoaded", () => {
    buscarPokemons();

    document.getElementById("search-button").addEventListener("click", () => {
        const nomePokemon = document.getElementById("pokemon-input").value.trim();
        buscarPokemons(6, nomePokemon);
    });

    document.getElementById("pokemon-input").addEventListener("keypress", (evento) => {
        if (evento.key === "Enter") {
            document.getElementById("search-button").click();
        }
    });
});

async function buscarPokemons(limite = 6, nome = "") {
    let url;
    const lista = document.getElementById("pokemon-list");

    try {
        if (nome) {
            url = `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`;
            const resposta = await fetch(url);
            if (!resposta.ok) {
                throw new Error('Pokémon não encontrado');
            }

            const dados = await resposta.json();
            lista.innerHTML = "";
            await mostrarPokemon(dados, lista);
        } 
        else {
            url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}`;
            const resposta = await fetch(url);
            const dados = await resposta.json();
            lista.innerHTML = "";

            for (const pokemon of dados.results) {
                const detalhes = await fetch(pokemon.url).then(res => res.json());
                await mostrarPokemon(detalhes, lista);
            }
        }
    } catch (erro) {
        lista.innerHTML = `
            <li class="error-card">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e3350d; margin-bottom: 20px;"></i>
                <h3>Pokémon não encontrado!</h3>
                <p>${erro.message}</p>
                <p style="margin-top: 15px;">Tente pesquisar por outro nome ou número.</p>
            </li>
        `;
    }
}

async function mostrarPokemon(detalhes, lista) {
    const dadosEspecie = await fetch(detalhes.species.url).then(res => res.json());
    const descricao = dadosEspecie.flavor_text_entries.find(
        entrada => entrada.language.name === "en"
    )?.flavor_text || "Descrição indisponível.";

    const tipos = detalhes.types.map(t => `<span class="type type-${t.type.name}">${t.type.name}</span>`).join("");

    const item = document.createElement("li");
    item.classList.add("pokemon-card");
    item.innerHTML = `
        <div class="pokemon-id">#${detalhes.id.toString().padStart(3, '0')}</div>
        <img class="pokemon-img" src="${detalhes.sprites.other['official-artwork'].front_default || detalhes.sprites.front_default}" alt="${detalhes.name}">
        <h3>${detalhes.name.charAt(0).toUpperCase() + detalhes.name.slice(1)}</h3>
        <div class="types">${tipos}</div>
        <div class="pokemon-info">
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">${detalhes.height / 10}m</div>
                    <div class="stat-label">ALTURA</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${detalhes.weight / 10}kg</div>
                    <div class="stat-label">PESO</div>
                </div>
            </div>
            <p class="description">${descricao}</p>
        </div>
    `;

    lista.appendChild(item);
}