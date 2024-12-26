import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BannerDetailComponent } from 'src/app/core/components/banner-detail/banner-detail.component';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { IMovieContent } from 'src/app/models/movie-contents.interface';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, map, of } from 'rxjs';
import { HeaderDetailComponent } from 'src/app/core/components/header-detail/header-detail.component';
import { FormsModule } from '@angular/forms';
import {FooterComponent} from 'src/app/core/components/footer/footer.component';

@Component({
  selector: 'app-browse-detail',
  standalone: true,
  imports: [FooterComponent, CommonModule, HeaderComponent, HeaderDetailComponent, BannerDetailComponent, FormsModule, CarouselComponent],
  templateUrl: './browse-detail.component.html',
  styleUrls: ['./browse-detail.component.css']
})
export class BrowseDetailComponent implements OnInit {
  id: number = 0;
  d_title: string = "";

  auth = inject(AuthService);
  movieService = inject(MoviesService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  userImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;

  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();
  bannerTitle: string = "";
  key: string = "";
  movieId: string =  "";
  videoKey: string = "";

  movies: IMovieContent[] = [];
  tvShows: IMovieContent[] = [];
  ratedMovies: IMovieContent[] = [];
  nowPlaying: IMovieContent[][] = [];
  upcoming: IMovieContent[] = [];
  popular: IMovieContent[][] = [];  // Changed this to an array of arrays of IMovieContent
  topRated: IMovieContent[][] = [];
  numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedCategory: string = 'popular'; 

  /* Array of Observables */
  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getTopRated(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];
  
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id')!;

      // Set the display title based on the ID
      switch (this.id) {
        case 1:
          this.d_title = "TV Shows";
          break;
        case 2:
          this.d_title = "Movies";
          break;
        case 3:
          this.d_title = "New & Popular";
          break;
        case 4:
          this.d_title = "My List";
          break;
        default:
          this.router.navigate(['browse']);
          return; // Exit early if invalid ID
      }

      // Fetch all data using forkJoin
      forkJoin(this.sources)
  .pipe(
    map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated]) => {
      // Split popular.results into chunks of 5 IMovieContent objects
      const popularChunks: IMovieContent[][] = [];
      for (let i = 0; i < popular.length; i += 5) {
        popularChunks.push(popular.slice(i, i + 5));
      }

      // Split nowPlaying.results into chunks of 5 IMovieContent objects
      const nowPlayingChunks: IMovieContent[][] = [];
      for (let i = 0; i < nowPlaying.length; i += 5) {
        nowPlayingChunks.push(nowPlaying.slice(i, i + 5));
      }

      // Split topRated.results into chunks of 5 IMovieContent objects
      const topRatedChunks: IMovieContent[][] = [];
      for (let i = 0; i < topRated.length; i += 5) {
        topRatedChunks.push(topRated.slice(i, i + 5));
      }

      let selectedItem;

      switch (this.id) {
        case 1: // Randomize TV Shows
          const randomIndex = Math.floor(Math.random() * tvShows.length);
          selectedItem = tvShows?.[randomIndex];
          break;
        case 2: // Movies
          selectedItem = movies?.[1];
          break;
        case 3: // New & Popular
          selectedItem = popular?.[0];
          break;
        case 4: // My List
          selectedItem = nowPlaying?.[1];
          break;
      }
      console.log(selectedItem.tmdb_id);
      if (selectedItem) {
        this.bannerDetail$ = this.movieService.getBannerDetail(selectedItem.tmdb_id) || of(null);
        this.bannerVideo$ = this.movieService.getBannerVideo(selectedItem.tmdb_id) || of(null);
        this.movieId = selectedItem.tmdb_id;
      }

      return {
        movies,
        tvShows,
        ratedMovies,
        nowPlaying: nowPlayingChunks,  // Updated to be an array of chunks
        upcoming,
        popular: popularChunks,       // Already an array of chunks
        topRated: topRatedChunks,     // Updated to be an array of chunks
      };
    })
  )
  .subscribe((res: any) => {
    // Assign results to the respective arrays
    
    this.movies = res.movies as IMovieContent[];
    this.tvShows = res.tvShows as IMovieContent[];
    this.ratedMovies = res.ratedMovies as IMovieContent[];
    this.nowPlaying = res.nowPlaying;  // NowPlaying is now a list of lists
    this.upcoming = res.upcoming as IMovieContent[];
    this.popular = res.popular;        // Popular is a list of lists
    this.topRated = res.topRated;      // TopRated is a list of lists
    
    // Fetch the video key for the selected item
    this.movieService.getBannerVideo(parseInt(this.movieId, 10)).subscribe((response: any) => {
      const trailers = response.results.filter((video: any) => video.type === 'Trailer'); // Filter trailers

      if (trailers.length > 0) {
        this.videoKey = trailers[0].key;  // Get the key of the first trailer
      } else {
        this.videoKey = "";  // No trailer found, set to null
      }
    });
  });

    });
  }
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
    alert(this.selectedCategory);
    // You can add logic here to fetch data based on the selected category
  }
  signOut() {
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}
