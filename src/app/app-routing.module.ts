import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { BrowseDetailComponent } from './pages/browse-detail/browse-detail.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactusComponent } from './pages/contactus/contactus.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'browse/:id', component: BrowseDetailComponent},
  {path: 'browse', component: BrowseComponent},
  {path: 'movie/:id', component:MovieDetailComponent},
  {path: 'profil', component:ProfilComponent},
  {path: 'about', component:AboutComponent},
  {path: 'contactus', component:ContactusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
