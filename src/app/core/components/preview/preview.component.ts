import { Component, HostListener, Input, OnChanges, SimpleChanges,ViewChild,ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { HttpClient } from '@angular/common/http'; // Import HttpClient


@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink,NgIf, VideoPlayerComponent],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnChanges {
  @Input() movieIDD ="";
  @Input() title="";
  @Input() desc="";
  @Input() Video = "";
  @Input() videoUrl1="";
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;


  faPlay = faPlay;
  faCircleInfo = faCircleInfo;
  videoUrl: SafeResourceUrl | undefined;
  isModalOpen: boolean = false; // Modal state (open or closed)
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  //isModalOpen: boolean = false;
  videofilm: string = 'tfarrej-backend.onrender.com/assets/movies/video.mp4'; // Replace with actual server video path

  // Toggle modal
  constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}

  openModal() {
    this.isModalOpen = true;
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/?autoplay=1&loop=10&controls=0`
    );

    // Define the JSON data to send
    const historyData = {
      email: this.email,  // Replace with actual email
      movieId: this.movieIDD,  // Replace with actual movieId
      date: new Date().toISOString(),  // Use current date/time or provide the actual date
    };
    console.log(historyData);

    // Send the POST request
    this.http.post('https://tfarrej-backend.onrender.com/movies/history', historyData).subscribe(
      (response) => {
        console.log('Movie history saved successfully:', response);
      },
      (error) => {
        console.error('Error saving movie history:', error);
      }
    );
  }

  closeModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.Video}?autoplay=1&loop=10&controls=0`
    );
    //videthis.isModalOpen = false;
    this.videofilm = ''; // Reset the video URL when modal is closed
  }

  // Play/Pause functionality
  playPause() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  // Mute/Unmute functionality
  muteUnmute() {
    const video = this.videoPlayer.nativeElement;
    video.muted = !video.muted;
  }

  // Set volume
  setVolume(event: any) {
    const video = this.videoPlayer.nativeElement;
    video.volume = event.target.value / 100;
  }
  // Method to open the modal
  

  // Method to close the modal
  //constructor(private domSanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Check if the Video Input changes
    
    if (changes['Video'] && changes['Video'].currentValue && this.isModalOpen==false ) {
      // Update videoUrl when Video changes
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.Video}?autoplay=1&loop=10&controls=0`
      );
    }
    
  }
  
}
