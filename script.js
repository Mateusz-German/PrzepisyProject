const container = document.getElementById("container");
const wyszukiwarka = document.getElementById("wyszukiwarka");
const pokazUlubione = document.getElementById("pokazUlubione");
const wszystkiePrzepisy = document.getElementById("wszystkiePrzepisy");
const kategoria = document.getElementById("kategoria");

let czyUlubione = false;
let przepisy = [];

async function pobierzPrzepisy() {

    try {

        container.innerHTML = "<h2>Ładowanie...</h2>";

        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");

        const dane = await response.json();

        przepisy = dane.meals;

        pokazPrzepisy(przepisy);

        dodajKategorie();

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

            <p><strong>Kategoria:</strong> ${przepis.strCategory}</p>

            <p><strong>Kuchnia:</strong> ${przepis.strArea}</p>

            <img src="${przepis.strMealThumb}" alt="${przepis.strMeal}">

            <p class="opis">
                ${przepis.strInstructions.slice(0, 250)}...
            </p>

            <button class="przycisk">
                Pokaż więcej
            </button>

            <button class="serce">
            ❤️
            </button>

            ${czyUlubione ? `
            <button class="usun">
                Usuń z ulubionych
            </button>
            ` : ""}
        </div>
        `;
    });

    const przyciski = document.querySelectorAll(".przycisk");

    const serca = document.querySelectorAll(".serce");

    const usunPrzyciski = document.querySelectorAll(".usun");

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

    serca.forEach((serce, index) => {

        serce.addEventListener("click", () => {

            dodajDoUlubionych(lista[index]);
        });
    });

    usunPrzyciski.forEach((przycisk, index) => {

        przycisk.addEventListener("click", () => {

            usunZUlubionych(lista[index].idMeal);
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

kategoria.addEventListener("change", () => {

    if(kategoria.value === "all") {

        pokazPrzepisy(przepisy);

    } else {

        const filtrowaneKategorie = przepisy.filter(przepis =>
            przepis.strCategory === kategoria.value
        );

        pokazPrzepisy(filtrowaneKategorie);
    }
});

pobierzPrzepisy();

function dodajDoUlubionych(przepis) {

    let ulubione = JSON.parse(localStorage.getItem("ulubione")) || [];

    const istnieje = ulubione.some(
        element => element.idMeal === przepis.idMeal
    );

    if(!istnieje) {

        ulubione.push(przepis);

        localStorage.setItem("ulubione", JSON.stringify(ulubione));

        alert("Dodano do ulubionych");

    } else {

        alert("Przepis już jest w ulubionych");
    }
}

pokazUlubione.addEventListener("click", () => {

    const ulubione = JSON.parse(localStorage.getItem("ulubione")) || [];

    czyUlubione = true;

    pokazPrzepisy(ulubione);
});

wszystkiePrzepisy.addEventListener("click", () => {

    czyUlubione = false;

    pokazPrzepisy(przepisy);
});

function usunZUlubionych(id) {

    let ulubione = JSON.parse(localStorage.getItem("ulubione")) || [];

    ulubione = ulubione.filter(przepis => przepis.idMeal !== id);

    localStorage.setItem("ulubione", JSON.stringify(ulubione));

    pokazPrzepisy(ulubione);
}

function dodajKategorie() {

    const wszystkieKategorie = [...new Set(
        przepisy.map(przepis => przepis.strCategory)
    )];

    wszystkieKategorie.forEach(kat => {

        kategoria.innerHTML += `
        
        <option value="${kat}">
            ${kat}
        </option>
        `;
    });
}