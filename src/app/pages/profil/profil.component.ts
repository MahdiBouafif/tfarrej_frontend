import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  auth = inject(AuthService);
  movieService = inject(MoviesService);
  http = inject(HttpClient);
  name = JSON.parse(sessionStorage.getItem('loggedInUser')!).name;
  email = JSON.parse(sessionStorage.getItem('loggedInUser')!).email;
  userImg = JSON.parse(sessionStorage.getItem('loggedInUser')!).picture;
  user: any = {
    name: this.name,
    history: [],
  };

  currentPage = 1; // Track the current page
  itemsPerPage = 10; // Number of items per page

  ngOnInit(): void {
    this.getMovieHistory();
  }

  // Fetch movie history from the backend
  getMovieHistory() {
    this.http
      .get<any[]>(
        `http://localhost:9992/history/gethistory?email=${this.email}`
      )
      .subscribe(
        async (history) => {
          // Clear the history before pushing the new values
          this.user.history = [];

          // Loop through the history array in reverse order (starting from the last entry)
          for (let i = history.length - 1; i >= 0; i--) {
            const entry = history[i];

            try {
              // Wait for the movie details to be fetched for each entry
              const movieDetails = await this.getMovieDetails(entry.movieId);

              // Push the movie details into the history array in order
              this.user.history.push({
                id: movieDetails.tmdb_id,
                title: movieDetails.title,
                image: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
                date: this.formatDate(entry.date),
                overview: movieDetails.overview,
                dateraw: entry.date, // Raw date for sorting
              });
            } catch (error) {
              console.error('Error fetching movie details:', error);
            }
          }

          console.log(
            'Final User History (Processed from Last):',
            this.user.history
          ); // Ensure the history is correctly populated
        },
        (error) => {
          console.error('Error fetching movie history:', error);
        }
      );
  }

  // Fetch movie details by movieId
  getMovieDetails(movieId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`http://localhost:9992/movies/idmovie/${movieId}`)
        .subscribe(
          (movieDetails) => {
            resolve(movieDetails);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // Format the date without adding an hour
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  }

  // Get movies for the current page
  getMoviesForCurrentPage(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.user.history.slice(start, end);
  }

  // Handle page change
  changePage(page: number) {
    this.currentPage = page;
  }

  // Get the total number of pages
  get totalPages(): number {
    return Math.ceil(this.user.history.length / this.itemsPerPage);
  }
}
