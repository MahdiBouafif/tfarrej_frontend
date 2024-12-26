import { PreviewComponent } from './../../core/components/preview/preview.component';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { IMovieContent } from 'src/app/models/movie-contents.interface';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import {FooterComponent} from 'src/app/core/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
//import {BannerComponent} from 'src/app/core/components/banner/banner.component'


@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [FooterComponent, CommonModule, HeaderComponent, PreviewComponent, CarouselComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  auth = inject(AuthService);
  movieService = inject(MoviesService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  userImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
  videoKey!: string;
  movieId!: string;
 
  id=parseInt(this.movieId,10);
  
  source: any; // Variable to store movie details

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Scroll to the top when the component is loaded
    window.scrollTo(0, 0);
  
    // Retrieve the 'id' parameter from the route
    this.route.paramMap.subscribe((params) => {
      this.movieId = params.get('id') || ''; // Get the 'id' from the URL
  
      // Fetch movie details and assign to source
      this.movieService.getBannerDetail(parseInt(this.movieId, 10)).subscribe(
        (response) => {
          console.log(response);
          this.source = response;
        },
        (error) => {
          console.error('Error fetching movie details:', error);
        }
      );
    });
  
    this.movieService.getBannerVideo(parseInt(this.movieId, 10)).subscribe((response: any) => {
      const trailers = response.results.filter((video: any) => video.type === 'Trailer'); // Filter trailers
  
      if (trailers.length > 0) {
        this.videoKey = trailers[0].key;  // Get the key of the first trailer
      } else {
        this.videoKey = "";  // No trailer found, set to empty string
      }
    });
  }
  
 

  //vidd=this.movieService.getBannerVideo(parseInt(this.movieId, 10));

  
  
}