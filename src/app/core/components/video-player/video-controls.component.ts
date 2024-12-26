import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-controls">
      <button class="control-button" (click)="onPlayPause()">
        <span class="material-icons">
          {{ isPlaying ? 'pause' : 'play_arrow' }}
        </span>
      </button>

      <div 
        class="progress-bar" 
        #progressBar
        (mousedown)="startSeeking($event)"
        (mousemove)="seeking($event)"
        (mouseup)="endSeeking()"
        (mouseleave)="endSeeking()"
      >
        <div class="progress" [style.width.%]="progress"></div>
        <div class="progress-hover" [style.width.px]="hoverPosition"></div>
        <div class="progress-handle" [style.left.%]="progress"></div>
      </div>

      <span class="time-display">
        {{formatTime(currentTime)}} / {{formatTime(duration)}}
      </span>

      <div class="volume-control">
        <button class="control-button" (click)="onMute()">
          <span class="material-icons">
            {{ getVolumeIcon() }}
          </span>
        </button>
        <div class="volume-slider-container">
          <input 
            type="range" 
            class="volume-slider" 
            min="0" 
            max="1" 
            step="0.1"
            [value]="volume"
            (input)="onVolumeChange($event)"
          >
        </div>
      </div>

      <button class="control-button" (click)="onFullscreen()">
        <span class="material-icons">
          {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
        </span>
      </button>
    </div>
  `
})
export class VideoControlsComponent {
  @ViewChild('progressBar') progressBar!: ElementRef;
  
  @Input() isPlaying = false;
  @Input() isMuted = false;
  @Input() progress = 0;
  @Input() currentTime = 0;
  @Input() duration = 0;
  @Input() volume = 1;
  @Input() isFullscreen = false;

  @Output() playPause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() mute = new EventEmitter<void>();
  @Output() volumeChange = new EventEmitter<number>();
  @Output() fullscreen = new EventEmitter<void>();

  isMouseDown = false;
  hoverPosition = 0;

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getVolumeIcon(): string {
    if (this.isMuted || this.volume === 0) {
      return 'volume_off';
    }
    if (this.volume < 0.5) {
      return 'volume_down';
    }
    return 'volume_up';
  }

  calculatePosition(event: MouseEvent): number {
    const rect = this.progressBar.nativeElement.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, position));
  }

  startSeeking(event: MouseEvent) {
    this.isMouseDown = true;
    const position = this.calculatePosition(event);
    this.seek.emit(position * this.duration);
  }

  seeking(event: MouseEvent) {
    const position = this.calculatePosition(event);
    this.hoverPosition = event.clientX - this.progressBar.nativeElement.getBoundingClientRect().left;
    
    if (this.isMouseDown) {
      this.seek.emit(position * this.duration);
    }
  }

  endSeeking() {
    this.isMouseDown = false;
  }

  onPlayPause() {
    this.playPause.emit();
  }

  onMute() {
    this.mute.emit();
  }

  onVolumeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.volumeChange.emit(Number(value));
  }

  onFullscreen() {
    this.fullscreen.emit();
  }
}