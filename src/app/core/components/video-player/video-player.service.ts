import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {
  private playPromise: Promise<void> | null = null;
  private videoElement: HTMLVideoElement | null = null;

  private playingState = new BehaviorSubject<boolean>(false);
  playing$ = this.playingState.asObservable();

  setVideoElement(element: HTMLVideoElement) {
    this.videoElement = element;
  }

  async togglePlay() {
    if (!this.videoElement) return;

    try {
      if (this.videoElement.paused) {
        // Wait for any existing play promise to resolve
        if (this.playPromise) {
          await this.playPromise;
        }
        this.playPromise = this.videoElement.play();
        await this.playPromise;
        this.playingState.next(true);
      } else {
        // Wait for any existing play promise to resolve before pausing
        if (this.playPromise) {
          await this.playPromise;
        }
        this.videoElement.pause();
        this.playingState.next(false);
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
      this.playingState.next(false);
    } finally {
      this.playPromise = null;
    }
  }

  seek(time: number) {
    if (this.videoElement) {
      this.videoElement.currentTime = time;
    }
  }

  setVolume(volume: number) {
    if (this.videoElement) {
      this.videoElement.volume = volume;
    }
  }

  toggleMute() {
    if (this.videoElement) {
      this.videoElement.muted = !this.videoElement.muted;
    }
  }
}