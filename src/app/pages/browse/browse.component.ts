import { BannerComponent } from './../../core/components/banner/banner.component';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { IMovieContent } from 'src/app/models/movie-contents.interface';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import {FooterComponent} from 'src/app/core/components/footer/footer.component';


@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [FooterComponent,CommonModule, HeaderComponent, BannerComponent, CarouselComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit{

  auth = inject(AuthService);
  movieService = inject(MoviesService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  userImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;

  movies: IMovieContent[] = [];
  tvShows: IMovieContent[] = [];
  ratedMovies: IMovieContent[] = [];
  nowPlaying: IMovieContent[] = [];
  upcoming: IMovieContent[] = [];
  popular: IMovieContent[] = [];
  topRated: IMovieContent[] = [];

  /* Array of Observables */
  
  //constructor(private moviesService: MoviesService) {}
  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];
  ngOnInit(): void {
    forkJoin(this.sources)
      .pipe(
        map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated]) => {
          return { movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated };
        })
      ).subscribe((res: any) => {
        this.movies = res.movies as IMovieContent[];
        this.tvShows = this.sortWithFixedRandom(res.tvShows) as IMovieContent[];
        this.ratedMovies = res.ratedMovies as IMovieContent[];
        this.nowPlaying = res.nowPlaying as IMovieContent[];
        this.upcoming = res.upcoming as IMovieContent[];
        this.popular = res.popular as IMovieContent[];
        this.topRated = res.topRated as IMovieContent[];
      });
  }
  
  /**
   * Sort an array with a consistent random order based on a unique field.
   * @param items Array of IMovieContent
   * @returns Sorted array with fixed pseudo-random order
   */
  sortWithFixedRandom(items: IMovieContent[]): IMovieContent[] {
    return items.sort((a, b) => this.hashCode(a.tmdb_id) - this.hashCode(b.tmdb_id)); // Use `id` or another unique field
  }
  
  /**
   * Simple hash function for consistent pseudo-random values.
   * @param input Unique identifier (e.g., id)
   * @returns Numeric hash
   */
  hashCode(input: string | number): number {
    return String(input).split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
  }
  

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}
