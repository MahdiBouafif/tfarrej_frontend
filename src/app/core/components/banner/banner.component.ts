import { Component, HostListener, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  @Input() movieID =0;
  videoVariable: boolean = false;

  faPlay = faPlay;
  faCircleInfo = faCircleInfo;

  constructor(private domSanitizer: DomSanitizer) {}
  videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/nt8yOBic55c?&autoplay=1&loop=1&controls=0');

  @HostListener("document:scroll")
  scrollfunction(){
    if(document.documentElement.scrollTop > 300)
    {
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/nt8yOBic55c?&autoplay=0&loop=1&controls=0');
    }
    else {
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/nt8yOBic55c?&autoplay=1&loop=1&controls=0');
    }
  }
}
