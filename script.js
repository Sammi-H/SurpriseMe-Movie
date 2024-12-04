const movieBtn = document.getElementById("movies-btn");
const seriesBtn = document.getElementById("series-btn");
const genreDropdown = document.getElementById("genre-dropdown");
const yearbtn = document.getElementById("year-btn");
const yearDropdown = document.getElementById("year");
const resetmeBtn = document.getElementById("resetme-btn");
const surprisemeBtn = document.getElementById("main-btn");
const watchTrailerBtn = document.getElementById("watch-trailer-btn");
const surpriseMeAgainBtn = document.getElementById("surprise-me-again-btn");

let currentType = "movie";
let currentPage = 1; 
let selectedGenre = null;
let selectedYear = null;


async function fetchGenres(type) {
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=bd1fc02a2ec65448f4c69e49bca6afa1&language=en-US`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        genreDropdown.innerHTML = "<option disabled selected>Select a genre</option>";

        data.genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreDropdown.appendChild(option);
        });

        genreDropdown.classList.remove("hidden");
    } catch (error) {
        console.log("Failed to fetch genres", error);
    }
}


movieBtn.addEventListener("click", () => {
    currentType = "movie";
    fetchGenres("movie");
    toggleButtonsVisibility(true);
});


seriesBtn.addEventListener("click", () => {
    currentType = "tv";
    fetchGenres("tv");
    toggleButtonsVisibility(true);
});


yearbtn.addEventListener("click", () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
        years.push(year);
    }

    yearDropdown.innerHTML = "<option disabled selected>Select a year</option>";

    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    yearDropdown.classList.remove("hidden");
});


resetmeBtn.addEventListener("click", () => {
    genreDropdown.classList.add("hidden");
    yearDropdown.classList.add("hidden");
    genreDropdown.value = "";
    yearDropdown.value = "";
    console.clear();
});


surprisemeBtn.addEventListener("click", async () => {
    selectedGenre = genreDropdown.value;
    selectedYear = yearDropdown.value;

    if (!selectedGenre || !selectedYear) {
        console.error("Please select genre and year");
        return;
    }

    const url = `https://api.themoviedb.org/3/discover/${currentType}?api_key=bd1fc02a2ec65448f4c69e49bca6afa1&with_genres=${selectedGenre}&year=${selectedYear}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            const item = data.results[0];
            const itemId = item.id;
            window.location.href = `movie.html?id=${itemId}&type=${currentType}&genre=${selectedGenre}&year=${selectedYear}`;
        } else {
            displayErrorMessage("No movies or series found for your selection.");
        }
    } catch (error) {
        console.log("Failed to fetch movie/series", error);
        displayErrorMessage("An error occurred while fetching data.");
    }
});


surpriseMeAgainBtn.addEventListener("click", async () => {
    if (!selectedGenre || !selectedYear) {
        console.error("Please select genre and year");
        return;
    }

    currentPage++; 

    const url = `https://api.themoviedb.org/3/discover/${currentType}?api_key=bd1fc02a2ec65448f4c69e49bca6afa1&with_genres=${selectedGenre}&year=${selectedYear}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            const item = data.results[0];
            const itemId = item.id;
            window.location.href = `movie.html?id=${itemId}&type=${currentType}&genre=${selectedGenre}&year=${selectedYear}`;
        } else {
            currentPage = 1; 
            displayErrorMessage("No more movies or series found for your selection.");
        }
    } catch (error) {
        console.log("Failed to fetch movie/series", error);
        displayErrorMessage("An error occurred while fetching data.");
    }
});


function displayErrorMessage(message) {
    const modal = document.getElementById("error-modal");
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;

    const newSearchBtn = document.getElementById("new-search-btn");
    newSearchBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    modal.style.display = "block";
    const closeModal = document.getElementById("close-modal");
    closeModal.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function toggleButtonsVisibility(show) {
    const surpriseMeAgainButton = document.getElementById('surprise-me-again');
    const resetMeButton = document.getElementById('reset-me');

    if (surpriseMeAgainButton && resetMeButton) {
        if (show) {
            surpriseMeAgainButton.classList.remove('hidden');
            resetMeButton.classList.remove('hidden');
        } else {
            surpriseMeAgainButton.classList.add('hidden');
            resetMeButton.classList.add('hidden');
        }
    }
}
