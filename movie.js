window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');
    const contentType = urlParams.get('type');
    const genreId = urlParams.get('genre'); 
    const year = urlParams.get('year'); 

    if (!contentId || !contentType) {
        return;
    }

    async function fetchContentDetails(id, type) {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=bd1fc02a2ec65448f4c69e49bca6afa1&language=en-US`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch content details");
            }
            const content = await response.json();
            displayContentDetails(content);
        } catch (error) {
            displayErrorMessage("Sorry, something went wrong while fetching the details. Please try again later.");
        }
    }

    function displayContentDetails(content) {
        const movieContainer = document.getElementById("movie-container");

        if (!content || (!content.title && !content.name)) {
            movieContainer.innerHTML = `
                <div class="no-results">
                    <p>No movies or series found. Please try a new search.</p>
                    <button class="btn" id="new-search-btn">New Search</button>
                </div>
            `;
            const newSearchButton = document.getElementById("new-search-btn");
            if (newSearchButton) {
                newSearchButton.addEventListener('click', function() {
                    window.location.href = 'index.html'; 
                });
            }
            return;
        }

        const backdropUrl = content.backdrop_path ? `https://image.tmdb.org/t/p/w1280${content.backdrop_path}` : '';
        const posterUrl = content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : '';
        const contentOverview = content.overview || 'No description available';
        const contentTitle = content.name || content.title;
        const isMovie = contentType === 'movie';

        movieContainer.innerHTML = `
            <div class="movie-header" style="background-image: url(${backdropUrl});">
                <h2>${contentTitle}</h2>
            </div>
            <img src="${posterUrl}" alt="${contentTitle}" />
            <p>${contentOverview}</p>
            ${isMovie ? `
                <a href="https://www.youtube.com/results?search_query=${contentTitle} trailer" target="_blank">
                    <button class="btn">Watch Trailer</button>
                </a>
                <button class="btn" id="surprise-me-again">Surprise Me Again</button>
                <button class="btn" id="reset-me">Reset Me</button>
            ` : `
                <a href="https://www.youtube.com/results?search_query=${contentTitle} trailer" target="_blank">
                    <button class="btn">Watch Trailer</button>
                </a>
                <button class="btn" id="surprise-me-again">Surprise Me Again</button>
                <button class="btn" id="reset-me">Reset Me</button>
            `}
        `;

        const surpriseMeAgainButton = document.getElementById('surprise-me-again');
        const resetMeButton = document.getElementById('reset-me');

        if (surpriseMeAgainButton) {
            surpriseMeAgainButton.addEventListener('click', function() {
                
                if (genreId && year) {
                    fetchRandomContent(contentType, genreId, year);
                } else {
                    displayErrorMessage("No genre or year selected. Please select a genre and year.");
                }
            });
        }

        if (resetMeButton) {
            resetMeButton.addEventListener('click', function() {
                window.location.href = 'index.html';  
            });
        }
    }

    async function fetchRandomContent(type, genreId, year) {
        let randomPage = Math.floor(Math.random() * 20) + 1;  
        const url = `https://api.themoviedb.org/3/discover/${type}?api_key=bd1fc02a2ec65448f4c69e49bca6afa1&language=en-US&page=${randomPage}&with_genres=${genreId}&primary_release_year=${year}`;
        
        try {
            let data;
            let results;
           
            do {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch random content");
                }
                data = await response.json();
                results = data.results;
                randomPage = Math.floor(Math.random() * 20) + 1; 
            } while (results.length === 0); 

            const randomItem = results[Math.floor(Math.random() * results.length)];
            displayContentDetails(randomItem);  
        } catch (error) {
            displayErrorMessage("Sorry, something went wrong while fetching the random content. Please try again later.");
        }
    }

    fetchContentDetails(contentId, contentType);
}

function displayErrorMessage(message) {
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}
