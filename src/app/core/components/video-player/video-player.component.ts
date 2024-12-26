import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoControlsComponent } from './video-controls.component';
import { VideoPlayerService } from './video-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-player',
  styleUrls: ['./video-player.component.css'],
  standalone: true,
  imports: [CommonModule, VideoControlsComponent],
  template: `
    

    <div class="modal-overlay" [class.show]="isModalOpen" (click)="closeModal($event)">
      <div class="video-container" #videoContainer>
        <video
          #videoPlayer
          (click)="handleVideoClick()"
          (timeupdate)="onTimeUpdate()"
          (loadedmetadata)="onVideoLoaded()"
          width="100%"
          [src]="videoUrl"
          preload="metadata"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
        >
          Your browser does not support the video tag.
        </video>

        <app-video-controls
          [isPlaying]="isPlaying"
          [isMuted]="isMuted"
          [progress]="progress"
          [currentTime]="currentTime"
          [duration]="duration"
          [volume]="volume"
          [isFullscreen]="isFullscreen"
          (playPause)="handlePlayPause()"
          (seek)="seek($event)"
          (mute)="toggleMute()"
          (volumeChange)="updateVolume($event)"
          (fullscreen)="toggleFullscreen()"
        ></app-video-controls>
      </div>
    </div>
  `
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef<HTMLDivElement>;

  @Input() isModalOpen = true;
  @Input() videoUrl = "";
  isPlaying = false;
  isMuted = false;
  progress = 0;
  @Output() modalClosed = new EventEmitter<boolean>();
  currentTime = 0;
  duration = 0;
  volume = 1;
  isFullscreen = false;
  // = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  private playingSubscription?: Subscription;

  constructor(private videoService: VideoPlayerService) {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
  }

  ngOnInit() {
    this.playingSubscription = this.videoService.playing$.subscribe(
      playing => this.isPlaying = playing
    );
  }

  ngOnDestroy() {
    this.playingSubscription?.unsubscribe();
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
  }

  onVideoLoaded() {
    this.videoService.setVideoElement(this.videoPlayer.nativeElement);
    this.duration = this.videoPlayer.nativeElement.duration;
    if (this.isModalOpen) {
      this.handlePlayPause();
    }
  }

  async openModal() {
    this.modalClosed.emit(true);
    this.isModalOpen = true;
    if (this.videoPlayer?.nativeElement?.duration) {
      await this.handlePlayPause();
    }
  }

  async closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.modalClosed.emit(false);
      this.isModalOpen = false;
      if (this.isPlaying) {
        await this.videoService.togglePlay();
      }
      this.videoService.seek(0);
    }
  }

  handleVideoClick() {
    this.handlePlayPause();
  }

  async handlePlayPause() {
    await this.videoService.togglePlay();
  }

  onTimeUpdate() {
    const video = this.videoPlayer.nativeElement;
    this.progress = (video.currentTime / video.duration) * 100;
    this.currentTime = video.currentTime;
  }

  seek(time: number) {
    this.videoService.seek(time);
  }

  toggleMute() {
    this.videoService.toggleMute();
    this.isMuted = this.videoPlayer.nativeElement.muted;
  }

  updateVolume(volume: number) {
    this.volume = volume;
    this.videoService.setVolume(volume);
  }

  handleFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.videoContainer.nativeElement.requestFullscreen();
    }
  }
}