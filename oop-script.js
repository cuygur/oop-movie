// the API documentation site https://developers.themoviedb.org/3/

class App {
        static async run() {
                const movies = await APIService.fetchMovies();
                const genres = await APIService.fetchGenres();
<<<<<<< HEAD
                console.log(movies);    
=======
                const current = await APIService.fetchNowPlaying();
                // console.log(movies);
                const currentMovies = document.getElementById('tvShows');
                let addMovies = movieList => HomePage.renderMovies(movieList, genres);
                currentMovies.addEventListener('click', ()=> addMovies(current));   
>>>>>>> dc55616a93654e337c9b3f472cdc301047f6c442
                HomePage.renderMovies(movies, genres);
                
        }
}

class APIService {
        static TMDB_BASE_URL = 'https://api.themoviedb.org/3';

        static async fetchMovies() {
                const url = APIService._constructUrl(`movie/now_playing`);
                const response = await fetch(url);
                const data = await response.json();
                return data.results.map(movie => new Movie(movie));
        }

        static async fetchMovie(movieId) {
                const url = APIService._constructUrl(`movie/${movieId}`);
                const response = await fetch(url);
                const data = await response.json();
                return new Movie(data);
        }

        static async fetchGenres() {
                const url = APIService._constructUrl('genre/movie/list');
                const response = await fetch(url);
                // data = {'genres': [{id: 12, name: 'adventure'}, ...]}
                const data = await response.json();
                const genres = data.genres.reduce((acc, genre) => {
                        acc[genre.id] = genre.name;
                        return acc;
                }, {});
                return genres;
        }

        static async fetchNowPlaying() {
                const url = APIService._constructUrl('tv/popular');
                const resp = await fetch(url);
                const data = await resp.json();
                return data.results.map(movie => new Movie(movie)); 
        }

        static _constructUrl(path) {
                return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
        }
}

class HomePage {
        static container = document.getElementById('container');

        static renderMovies(movies, genres) {
                const movieRow = document.createElement('div');
                movieRow.classList.add('row');
                this.container.innerHTML = "";
                this.container.appendChild(movieRow);

                movies.forEach(movie => {
                        /* for (let index = 0; movies.length < 3; index++) {
                        const movieRow = document.createElement('div');
                        movieRow.classList.add('col-md-6', 'col-lg-3');
                        } */
                        const movieGenreNames = movie.genreIds.map(genreId => genres[String(genreId)]);
                        const movieDiv = document.createElement('div');

                        movieDiv.classList.add('col-md-6', 'col-lg-4');

                        const movieImage = document.createElement('img');
                        movieImage.src = `${movie.backdropUrl}`;
                        movieImage.classList.add('img-fluid', 'my-4', 'rounded');
                        const movieTitle = document.createElement('h3');
                        movieTitle.textContent = `${movie.title}`;
                        movieTitle.classList.add('text-center');
                        movieImage.addEventListener('click', function() {
                                Movies.run(movie);
                        });
                        const movieInfo = document.createElement('div');
                        movieInfo.classList.add('movieInfo');
                        movieInfo.textContent = `rating: ${movie.rating}, genres: ${movieGenreNames}`;

                        const movieDescription = document.createElement('div');
                        movieDescription.classList.add('movieDescription');
                        movieDescription.textContent = movie.overview;

                        movieDiv.appendChild(movieTitle);
                        movieDiv.appendChild(movieImage);
                        movieDiv.appendChild(movieDescription);
                        movieDiv.appendChild(movieInfo);
                        // movieRow.appendChild(movieDiv);

                        movieRow.appendChild(movieDiv);
                });
        }
}



class Movies {
        static async run(movie) {
                const movieData = await APIService.fetchMovie(movie.id);
                MoviePage.renderMovieSection(movieData);
                APIService.fetchActors(movieData);
        }
}

class MoviePage {
        static container = document.getElementById('container');

        static renderMovieSection(movie) {
                MovieSection.renderMovie(movie);
        }
}

class MovieSection {
        static renderMovie(movie) {
                MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `;
        }
}

class Movie {
        static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';

        constructor(json) {
                this.rating = json.vote_average;
                this.genreIds = json.genre_ids;
                this.id = json.id;
                this.title = json.title || json.name;
                this.releaseDate = json.release_date;
                this.runtime = `${json.runtime} minutes`;
                this.overview = json.overview;
                this.backdropPath = json.backdrop_path;
        }

        get backdropUrl() {
                return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : '';
        }
}

document.addEventListener('DOMContentLoaded', App.run);
