import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-image-from-file',
  templateUrl: './image-from-file.component.html',
  styleUrls: ['./image-from-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CadrartButtonComponent, TranslateModule]
})
export class CadrartImageFromFileComponent {
  @Output() public cadrartCapture: EventEmitter<File> = new EventEmitter<File>();
  @Output() public cadrartCancel: EventEmitter<void> = new EventEmitter<void>();

  public capturedImage = signal<string | null>(null);

  private reader: FileReader = new FileReader();
  private file: File | null = null;

  constructor() {
    this.reader.onload = (): void => {
      this.capturedImage.set(this.reader.result as string);
    };
  }

  public handleLoadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);

    if (!file) {
      return;
    }

    this.reader.readAsDataURL(file);
    this.file = file;
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
  }

  public handleCaptureSave(): void {
    const val = this.file;

    if (val) {
      this.cadrartCapture.emit(val);
    }
  }
}
