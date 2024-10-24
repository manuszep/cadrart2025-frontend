import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartAlertService } from '../alert/alert.service';
import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, CadrartButtonComponent, TranslateModule]
})
export class CadrartImageCaptureComponent implements AfterViewInit, OnDestroy {
  @Output() public cadrartCapture: EventEmitter<File> = new EventEmitter<File>();
  @Output() public cadrartCancel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas?: ElementRef<HTMLCanvasElement>;

  private file: File | null = null;
  private destroyed = false;

  public capturedImage = signal<string | null>(null);

  constructor(private readonly alertService: CadrartAlertService) {}

  public ngAfterViewInit(): void {
    this.enableWebcam();
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.disableWebcam();
  }

  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const parts = arr[0].match(/:(.*?);/);

    if (!parts) {
      throw new Error('Could not parse data URL');
    }

    const mime = parts[1];
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private enableWebcam(): void {
    const video = this.video.nativeElement;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !this.video) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream: MediaStream) => {
        if (this.destroyed) {
          stream.getTracks().forEach((track: MediaStreamTrack) => {
            track.stop();
          });

          return;
        }

        video.srcObject = stream;
        video.play();
      })
      .catch(() => {
        this.alertService.add({
          type: 'danger',
          message: 'IMAGE.CAPTURE.ERROR.WEBCAM'
        });
      });
  }

  private disableWebcam(): void {
    const video = this.video.nativeElement;

    if (!video || !video.srcObject) {
      return;
    }

    const stream = video.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    video.srcObject = null;
  }

  getImageResizeInfo(image: HTMLVideoElement): { height: number; width: number } {
    const maxW = 1600;
    const maxH = 1200;
    const w = image.videoWidth;
    const h = image.videoHeight;
    const isVertical = h > w;
    const ratio = isVertical ? w / h : h / w;
    const sizeToUse = isVertical ? (h > maxH ? maxH : h) : w > maxW ? maxW : w;

    return isVertical
      ? {
          height: sizeToUse,
          width: sizeToUse * ratio
        }
      : {
          height: sizeToUse * ratio,
          width: sizeToUse
        };
  }

  private generateCanvasImage(): void {
    const video = this.video?.nativeElement;
    const canvas = this.canvas?.nativeElement;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const imageSize = this.getImageResizeInfo(video);

    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(video, 0, 0, imageSize.width, imageSize.height);

    const data = canvas.toDataURL('image/jpeg', 0.8);

    this.capturedImage.set(data);
    this.file = this.dataUrlToFile(data, 'image.jpg');
    this.disableWebcam();
  }

  public handleCancel(): void {
    this.cadrartCancel.emit();
  }

  public handleClear(): void {
    if (this.capturedImage()) {
      this.capturedImage.set(null);
    }

    if (this.file) {
      this.file = null;
    }

    this.enableWebcam();
  }

  public handleCaptureSave(): void {
    const val = this.file;

    if (val) {
      this.cadrartCapture.emit(val);
    }
  }

  public handleCaptureCapture(): void {
    this.generateCanvasImage();
  }
}
