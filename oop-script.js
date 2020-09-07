// the API documentation site https://developers.themoviedb.org/3/

class App {
        static async run() {
                const movies = await APIService.fetchMovies();
                const genres = await APIService.fetchGenres();
                const current = await APIService.fetchNowPlaying();
                const popularMovies = await APIService.fetchPopular();
                const latestMovies = await APIService.fetchLatest();
                const topRatedMovies = await APIService.fetchTopRated();
                const upcomingMovies = await APIService.fetchUpcoming();
                // console.log(movies);
                const currentMovies = document.getElementById('tvShows');
                let addMovies = movieList => HomePage.renderMovies(movieList, genres);
                currentMovies.addEventListener('click', ()=> addMovies(current)); 
                // latest movies 
                const latestMoviesElement = document.getElementById('latest');
                latestMoviesElement.addEventListener('click', () => addMovies(latestMovies))
                // upcoming movies
                const upcomingMoviesElement = document.getElementById('upcoming');
                upcomingMoviesElement.addEventListener('click', () => addMovies(upcomingMovies));
                // popular movies
                const popularMoviesElement = document.getElementById('popular');
                popularMoviesElement.addEventListener('click', () => addMovies(popularMovies));
                // top rated movies
                const topRatedMoviesElement = document.getElementById('topRated');
                topRatedMoviesElement.addEventListener('click', () => addMovies(topRatedMovies));
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

        static async fetchActors(movieId) { // to fetch the actors in movie page
                const url = APIService._constructUrl(`movie/${movieId}/credits`);
                const response = await fetch(url);
                const data = await response.json();
                return data.cast;
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

        static async fetchPopular() {
                const url = APIService._constructUrl('movie/popular');
                const response = await fetch(url);
                const data = await response.json();
                return data.results.map(movie => new Movie(movie));
        }

        static async fetchLatest() {
                const url = APIService._constructUrl('discover/movie', 'sort_by=release_date.desc');
                const response = await fetch(url);
                const data = await response.json();
                return data.results.map(movie => new Movie(movie));
        }

        static async fetchUpcoming() {
                const url = APIService._constructUrl(`movie/upcoming`);
                const response = await fetch(url);
                const data = await response.json();
                return data.results.map(movie => new Movie(movie));
        }

        static async fetchTopRated() {
                const url = APIService._constructUrl(`movie/top_rated`);
                const response = await fetch(url);
                const data = await response.json();
                return data.results.map(movie => new Movie(movie));
        }

        static _constructUrl(path, extraParam) {
                let url = `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
                if (extraParam) {
                        url += `&${extraParam}` // if there is more than one query (get) parametre, use ampersand
                } 
                return url
        }
}

class HomePage {
        static container = document.getElementById('container');

        static renderMovies(movies, genres) {
                const movieRow = document.createElement('div');
                movieRow.classList.add('row');
                this.container.innerHTML = ""; // to refresh the movie list in movie div
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
                const actors = await APIService.fetchActors(movie.id);
                movieData.actors = actors
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
      <p>${movie.actors.map(actor => actor.name)}</p>
    `;
        }
}

class Movie {
        static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';

        constructor(json) {
                this.rating = json.vote_average;
                this.genreIds = json.genre_ids;
                this.id = json.id;
                this.title = json.title || json.name; // title or name for the tv shows and the movies
                this.releaseDate = json.release_date;
                this.runtime = `${json.runtime} minutes`;
                this.overview = json.overview;
                this.backdropPath = json.backdrop_path;
        }

        get backdropUrl() {
                return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : 'https://via.placeholder.com/350x200.png';  // placeholder for the missing posters
        }
}

document.addEventListener('DOMContentLoaded', App.run);
