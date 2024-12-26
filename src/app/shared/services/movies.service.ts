import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  http = inject(HttpClient);

  private apiUrl = 'https://api.themoviedb.org/3';
  private authToken =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NzhlMzhhNTBmOGJiYWZjMGQyYzRlZmM2MDYzYmQwMCIsIm5iZiI6MTczMjEyNTExNS4xNDY0MjE0LCJzdWIiOiI2NzNkZWVkYzRlZTcyYjI3MmZlZjcwMDUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LOPRQtN85lzpWffKIlUMuDQFaSpZ4LENypt2blhFIw0';

  private defaultParams = new HttpParams()
    .set('include_adult', 'false')
    .set('include_video', 'true')
    .set('language', 'en-US')
    .set('page', '1')
    .set('sort_by', 'popularity.desc');
    private defaultpo = new HttpParams()
    .set('include_adult', 'false')
    .set('include_video', 'true')
    .set('language', 'en-US')
    .set('page', '2')
    .set('sort_by', 'popularity.desc');

  private defaultHeaders = new HttpHeaders({
    accept: 'application/json',
    Authorization: this.authToken,
  });

  getMovies() {
    return this.http.get<any>(`http://localhost:9992/movies`);
  }

  getTvShows() {
    return this.http.get(`http://localhost:9992/movies/top_rated`);
  }

  getRatedMovies() {
    return this.http.get(
      `http://localhost:9992/movies/popular`
      
    );
  }
  getTopRatedMoviesCombined(): Observable<any> {
    // Create an array of HTTP requests for each page (pages 1 to 5)
    const pageRequests = [];
    for (let page = 1; page <= 5; page++) {
      pageRequests.push(
        this.http.get(`http://localhost:9992/movies/top_rated`)
      );
    }
  
    // Use forkJoin to execute all requests simultaneously
    return forkJoin(pageRequests).pipe(
      map((responses: any[]) => {
        // Combine the results from all pages into a single array
        let combinedResults: any[] = [];
  
        responses.forEach((response) => {
          if (response.results) {
            combinedResults = combinedResults.concat(response.results);
          }
        });
  
        // Return the combined results in the same structure as the API response
        return { results: combinedResults };
      })
    );
  }
  getPopularMoviesCombined(): Observable<any> {
    // Create an array of HTTP requests for each page (pages 1 to 5)
    const pageRequests = [];
    for (let page = 1; page <= 5; page++) {
      pageRequests.push(
        this.http.get(`${this.apiUrl}/movie/popular`, {
          headers: this.defaultHeaders,
          params: this.defaultParams.set('page', page.toString()),
        })
      );
    }

    // Use forkJoin to execute all requests simultaneously
    return forkJoin(pageRequests).pipe(
      map((responses: any[]) => {
        // Combine the results from all pages into a single array
        let combinedResults: any[] = [];


        responses.forEach((response) => {
          if (response.results) {
            combinedResults = combinedResults.concat(response.results);
          }
        });

        // Return the combined results in the same structure as the API response
        return { results: combinedResults };
      })
    );
  }
  getNowPlayingMoviesCombined(): Observable<any> {
    // Create an array of HTTP requests for each page (pages 1 to 5)
    const pageRequests = [];
    for (let page = 1; page <= 5; page++) {
      pageRequests.push(
        this.http.get(`${this.apiUrl}/movie/now_playing`, {
          headers: this.defaultHeaders,
          params: this.defaultParams.set('page', page.toString()),
        })
      );
    }
  
    // Use forkJoin to execute all requests simultaneously
    return forkJoin(pageRequests).pipe(
      map((responses: any[]) => {
        // Combine the results from all pages into a single array
        let combinedResults: any[] = [];
  
        responses.forEach((response) => {
          if (response.results) {
            combinedResults = combinedResults.concat(response.results);
          }
        });
  
        // Return the combined results in the same structure as the API response
        return { results: combinedResults };
      })
    );
  }
  
  getBannerImage(id: number) {
    return this.http.get(`${this.apiUrl}/movie/${id}/images`, {
      headers: this.defaultHeaders,
    });
  }

  getBannerVideo(id: number) {
    return this.http.get(`${this.apiUrl}/movie/${id}/videos`, {
      headers: this.defaultHeaders,
    });
  }

  getBannerDetail(id: number) {
    return this.http.get(`http://localhost:9992/movies/idmovie/${id}`);
  }

  getBannerVideoTv(id: number) {
    return this.http.get(`${this.apiUrl}/tv/${id}/videos`, {
      headers: this.defaultHeaders,
    });
  }

  getBannerDetailTv(id: number) {
    return this.http.get(`${this.apiUrl}/tv/${id}`, {
      headers: this.defaultHeaders,
    });
  }

  getNowPlayingMovies() {
    return this.http.get(`http://localhost:9992/movies/now_playing`);
  }

  getPopularMovies() {
    return this.http.get(`http://localhost:9992/movies/popular`);
  }

  getTopRated() {
    return this.http.get(`http://localhost:9992/movies/top_rated`);
  }

  getUpcomingMovies() {
    return this.http.get(`http://localhost:9992/movies/top_rated`);
  }

  // Added Methods
  searchMovies(query: string): Observable<{ results: any[] }> {
    return this.http.get<any[]>(`http://localhost:9992/movies`, { headers: this.defaultHeaders })
      .pipe(
        map((movies: any[]) => {
          // Filter the movies based on the query
          const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
          );
  
          // Return a JSON object with results
          return { results: filteredMovies.slice(0, 4) };
        })
      );
  }
  
  

  searchTvShows(query: string) {
    return this.http.get(`${this.apiUrl}/search/tv`, {
      headers: this.defaultHeaders,
      params: this.defaultParams.set('query', query),
    });
  }

  getTrending(type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'day') {
    return this.http.get(`${this.apiUrl}/trending/${type}/${timeWindow}`, {
      headers: this.defaultHeaders,
    });
  }

  createRequestToken() {
    return this.http.get(`${this.apiUrl}/authentication/token/new`, {
      headers: this.defaultHeaders,
    });
  }

  createSession(requestToken: string) {
    return this.http.post(
      `${this.apiUrl}/authentication/session/new`,
      { request_token: requestToken },
      { headers: this.defaultHeaders }
    );
  }

  getAccountDetails(sessionId: string) {
    return this.http.get(`${this.apiUrl}/account`, {
      headers: this.defaultHeaders,
      params: new HttpParams().set('session_id', sessionId),
    });
  }

  discoverMoviesByGenre(genreId: number) {
    return this.http.get(`${this.apiUrl}/discover/movie`, {
      headers: this.defaultHeaders,
      params: this.defaultParams.set('with_genres', genreId),
    });
  }

  getGenres(type: 'movie' | 'tv') {
    return this.http.get(`${this.apiUrl}/genre/${type}/list`, {
      headers: this.defaultHeaders,
      params: this.defaultParams,
    });
  }
}
