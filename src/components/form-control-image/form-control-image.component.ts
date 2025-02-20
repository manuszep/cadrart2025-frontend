import { TranslateModule } from '@ngx-translate/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { EsfsFieldComponentBase } from '@manuszep/es-form-system';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICadrartFileResponse } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartTooltipService } from '../tooltip/tooltip.service';
import { CadrartFieldImagePathPipe } from '../../pipes/image.pipe';
import { CadrartModalService } from '../modal/modal.service';
import { CadrartImageCaptureComponent } from '../image-capture/image-capture.component';
import { CadrartFileService } from '../../services/file.service';
import { CadrartAlertService } from '../alert/alert.service';
import { CadrartImageComponent } from '../image/image.component';
import { CadrartImageFromFileComponent } from '../image-from-file/image-from-file.component';

import { CadrartFormControlImageBase } from './form-control-image.model';

export class CadrartFormControlImage extends CadrartFormControlImageBase {
  override fieldComponent = CadrartFormControlImageComponent;
}

@Component({
  selector: 'cadrart-form-control-image',
  templateUrl: './form-control-image.component.html',
  styleUrl: './form-control-image.component.scss',
  standalone: true,
  imports: [TranslateModule, CadrartButtonComponent, CadrartFieldImagePathPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFormControlImageComponent extends EsfsFieldComponentBase<string | null, CadrartFormControlImage> {
  @ViewChild('tooltipTemplate', { static: true }) tooltipTemplate?: TemplateRef<unknown>;

  @Output() captureAction = new EventEmitter<File>();
  @Output() cancelAction = new EventEmitter<void>();
  @Output() deleteAction = new EventEmitter<void>();

  constructor(
    private readonly tooltipService: CadrartTooltipService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly modalService: CadrartModalService,
    private readonly fileService: CadrartFileService,
    private readonly alertService: CadrartAlertService
  ) {
    super(cdRef);

    this.cancelAction.pipe(takeUntilDestroyed()).subscribe(() => this.modalService.closeModal());
    this.captureAction.pipe(takeUntilDestroyed()).subscribe((value) => this.save(value));
  }

  private save(value: File): void {
    this.fileService.upload(value, 'test.jpg', this.control.folder() ?? 'default').subscribe({
      next: (res: ICadrartFileResponse) => {
        if (res.statusCode === 200) {
          this.control.setValue(res.file);
          this.modalService.closeModal();
          this.cdRef.markForCheck();
        } else {
          this.alertService.add({
            type: 'danger',
            message: 'IMAGE.CAPTURE.ERROR.SAVE'
          });
        }
      },
      error: () => {
        this.alertService.add({
          type: 'danger',
          message: 'IMAGE.CAPTURE.ERROR.SAVE'
        });
      }
    });
  }

  public handleTooltipClick(e: MouseEvent): void {
    if (!this.tooltipTemplate) {
      return;
    }

    if (this.tooltipService.isOpen()) {
      this.tooltipService.close();

      return;
    }

    this.tooltipService.show({
      content: this.tooltipTemplate,
      target: e.target as HTMLElement
    });
  }

  public handleViewClick(): void {
    const value = this.control.value;

    this.tooltipService.close();

    if (!value) {
      return;
    }

    this.modalService.showModal({
      fullScreen: true,
      content: CadrartImageComponent,
      contentInputs: {
        name: value,
        folder: this.control.folder(),
        size: 'l'
      }
    });
  }

  public handleWebcamClick(): void {
    this.tooltipService.close();

    this.modalService.showModal({
      fullScreen: true,
      content: CadrartImageCaptureComponent,
      contentOutputs: {
        cadrartCapture: this.captureAction,
        cadrartCancel: this.cancelAction
      }
    });
  }

  public handleLoadClick(): void {
    this.tooltipService.close();

    this.modalService.showModal({
      fullScreen: true,
      content: CadrartImageFromFileComponent,
      contentOutputs: {
        cadrartCapture: this.captureAction,
        cadrartCancel: this.cancelAction
      }
    });
  }

  public handleDeleteClick(): void {
    const value = this.control.value;

    this.tooltipService.close();

    if (!value) {
      return;
    }

    this.fileService.delete(this.control.folder() ?? 'default', value).subscribe();

    this.control.setValue(null);
  }
}
