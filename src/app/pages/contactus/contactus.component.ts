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
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
  onSubmit(): void {
    console.log('Form Submitted', this.contact);
    // Here you can send the form data to your backend API or process it as needed
  }
  auth = inject(AuthService);
  movieService = inject(MoviesService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  userImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
}
