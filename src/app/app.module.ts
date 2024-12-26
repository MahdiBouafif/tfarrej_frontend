import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from  '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowseDetailComponent } from './pages/browse-detail/browse-detail.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { HeaderComponent } from "./core/components/header/header.component";
import { PreviewComponent } from './core/components/preview/preview.component';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from './pages/profil/profil.component';
import { VideoPlayerComponent } from './core/components/video-player/video-player.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { FooterComponent } from "./core/components/footer/footer.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfilComponent,
    AboutComponent,
    ContactusComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowseDetailComponent,
    HeaderComponent,
    MovieDetailComponent,
    PreviewComponent,
    FormsModule,
    VideoPlayerComponent,
    FooterComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
