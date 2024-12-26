import { Component, Input, inject, HostListener, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faArrowUpFromBracket, faUser, faCircleQuestion, faCaretDown, faCaretUp,faEnvelope,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IMovieContent } from 'src/app/models/movie-contents.interface';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { Observable, forkJoin, map, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink,FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  isMenuOpened: boolean = false;
  caretVariable: boolean = false;
  isBrowseOpened: boolean = false;
  browseVariable: boolean = false;
  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
    this.caretVariable = !this.caretVariable;
  }
  toggleBrowse(): void {
    this.isBrowseOpened = !this.isBrowseOpened;
    this.browseVariable = !this.browseVariable;
  }

  ngOnInit() {}
  faPencil = faPencil;
  faArrowUpFromBracket = faArrowUpFromBracket;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCircleQuestion = faCircleQuestion;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  faInfoCircle=faInfoCircle;

  @Input({required: true}) userImg = '';
  username = JSON.parse(sessionStorage.getItem('loggedInUser')!).name;
  auth = inject(AuthService);

  navList = [ {name: "Home", url: "/browse", "id": 0},
             
              {name: "Movies", url: "/movies", "id": 2}];

  headerVariable = false;
  @HostListener("document:scroll")
  scrollfunction(){
    if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0)
    {
      this.headerVariable = true;
    }
    else {
      this.headerVariable = false;
    }
  }
  searchQuery: string = '';
  isSearchOpen: boolean = false;

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;

    // Focus on the input when opened
    if (this.isSearchOpen) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0); // Allow DOM to update before focusing
    }
  }

  handleBlur() {
    if (!this.searchQuery) {
      this.isSearchOpen = false;
      this.isPopupVisible = false;
    }
  }
  isPopupVisible: boolean = false;
  movies: IMovieContent[] = [];
  searchResults: IMovieContent[] = [];
  movieService = inject(MoviesService);
  //suggestions: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  source$ = new Observable<any>();
  constructor(private cdr: ChangeDetectorRef) {}
  //constructor(private movieService: MoviesService) {}
  handleInputChange() {
    this.isPopupVisible = this.searchQuery.trim().length > 0;
    
    


 
    if (this.searchQuery.length > 2) {
      this.movieService.searchMovies(this.searchQuery).subscribe((response: { results: IMovieContent[] }) => {
        // Reassign the searchResults array with new data from the response
        this.searchResults = response.results; 
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching movies:', error); // Handle errors
          this.searchResults = []; // Clear results in case of error
        }
      );
    } else {
      this.searchResults = []; // Clear results if input is too short
    }
  }

  

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

  
}


