async function fetchData() {
    try {
        const pokemonName = document.getElementById("search").value.toLowerCase();
        const output = document.getElementById("pokemonSprite");
        const outputText = document.getElementById("handleError");
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        outputText.innerHTML = "";
        
        if (response.status === 404) {
            throw new Error("Pokemon not found");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;

        output.src = pokemonSprite;
        output.style.display = "block";
    } catch (error) {
        outputText.innerHTML = error.message;
    }
}
