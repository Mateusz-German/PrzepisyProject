const container = document.getElementById("container");
const wyszukiwarka = document.querySelector("input");

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

            <p>${przepis.strInstructions.slice(0, 150)}...</p>

        </div>
        `;
    });
}

// wyszukiwarka.addEventListener("input", () => {
    
   // const filtrowanePrzepisy = przepisy.filter(przepis =>
   //     przepis.nazwa.toLowerCase().includes(wyszukiwarka.value.toLowerCase())
        
 //   );

  //  pokazPrzepisy(filtrowanePrzepisy);
//});

pobierzPrzepisy();