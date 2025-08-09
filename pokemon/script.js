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

    if (nome) {
        url = `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`;
    } else {
        url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}`;
    }

    const lista = document.getElementById("pokemon-list");
    lista.innerHTML = ""; 

    try {
        if (nome) {
            const resposta = await fetch(url);
            if (!resposta.ok) {
                throw new Error('tem esse pokemon não pae');
            }

            const dados = await resposta.json();
            await mostrarPokemon(dados, lista);
        } 
        else {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            for (const pokemon of dados.results) {
                const detalhes = await fetch(pokemon.url).then(res => res.json());
                await mostrarPokemon(detalhes, lista);
            }
        }
    } catch (erro) {
        lista.innerHTML = `<p>${erro.message}</p>`;
    }
}

async function mostrarPokemon(detalhes, lista) {
    const dadosEspecie = await fetch(detalhes.species.url).then(res => res.json());
    const descricao = dadosEspecie.flavor_text_entries.find(
        entrada => entrada.language.name === "en"
    )?.flavor_text || "Descrição indisponível.";

    const tipos = detalhes.types.map(t => `<span class="type">${t.type.name}</span>`).join("");

    const item = document.createElement("li");
    item.classList.add("pokemon-card");
    item.innerHTML = `
        <img src="${detalhes.sprites.front_default}" alt="${detalhes.name}">
        <h3>${detalhes.name.toUpperCase()} (#${detalhes.id})</h3>
        <div class="pokemon-info">
            <p><strong>Tipos:</strong> ${tipos}</p>
            <p><strong>Altura:</strong> ${detalhes.height / 10} m</p>
            <p><strong>Peso:</strong> ${detalhes.weight / 10} kg</p>
            <p><em>${descricao}</em></p>
        </div>
    `;

    lista.appendChild(item);
}

