const container = document.getElementById("container");
const wyszukiwarka = document.getElementById("wyszukiwarka");

let przepisy = [];

async function pobierzPrzepisy() {

    try {

        container.innerHTML = "<h2>Ładowanie...</h2>";

        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");

        const dane = await response.json();

        przepisy = dane.meals;

        pokazPrzepisy(przepisy);

    } catch(error) {

        container.innerHTML = "<h2>Błąd pobierania danych</h2>";

        console.log(error);
    }
}

function pokazPrzepisy(lista) {

    container.innerHTML = "";

    if(lista.length === 0 || !lista) {

        container.innerHTML = "<h2>Brak przepisów</h2>";
        return;
    }

    lista.forEach(przepis => {

        container.innerHTML += `

        <div class="przepis">

            <h2>${przepis.strMeal}</h2>

            <img src="${przepis.strMealThumb}" alt="${przepis.strMeal}">

            <p class="opis">
                ${przepis.strInstructions.slice(0, 250)}...
            </p>

            <button class="przycisk">
                Pokaż więcej
            </button>
        </div>
        `;
    });

    const przyciski = document.querySelectorAll(".przycisk");

        przyciski.forEach((przycisk, index) => {

            przycisk.addEventListener("click", () => {

                const opis = document.querySelectorAll(".opis")[index];

                if(przycisk.textContent === "Pokaż więcej") {

                    opis.textContent = lista[index].strInstructions;
                    przycisk.textContent = "Pokaż mniej";

                } else {

                    opis.textContent = lista[index].strInstructions.slice(0, 150) + "...";
                    przycisk.textContent = "Pokaż więcej";
                }
            });
        });
}

wyszukiwarka.addEventListener("input", () => {

    const wpisanyTekst = wyszukiwarka.value.toLowerCase();

    const filtrowanePrzepisy = przepisy.filter(przepis =>
        przepis.strMeal.toLowerCase().includes(wpisanyTekst)
    );

    pokazPrzepisy(filtrowanePrzepisy);
});

pobierzPrzepisy();