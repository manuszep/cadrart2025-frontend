import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICadrartFileResponse } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../../components/button/button.component';
import { CadrartModalService } from '../../components/modal/modal.service';
import { CadrartFieldBaseComponent } from '../field.model';
import { CadrartFieldImagePathPipe } from '../../pipes/image.pipe';
import { CadrartTooltipComponent } from '../../components/tooltip/tooltip.component';
import { CadrartImageCaptureComponent } from '../../components/image-capture/image-capture.component';
import { CadrartImageFromFileComponent } from '../../components/image-from-file/image-from-file.component';
import { CadrartFileService } from '../../services/file.service';
import { CadrartAlertService } from '../../components/alert/alert.service';
import { CadrartImageComponent } from '../../components/image/image.component';
import { CadrartTooltipService } from '../../components/tooltip/tooltip.service';

import { CadrartFieldImage } from './image.config';

@Component({
  selector: 'cadrart-field-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, TranslateModule, CadrartButtonComponent, CadrartFieldImagePathPipe, CadrartTooltipComponent]
})
export class CadrartFieldImageComponent
  extends CadrartFieldBaseComponent<string, CadrartFieldImage>
  implements OnDestroy
{
  public label?: string;

  private readonly destroy$ = new Subject<void>();

  @Output() captureAction = new EventEmitter<File>();
  @Output() cancelAction = new EventEmitter<void>();
  @Output() deleteAction = new EventEmitter<void>();

  @ViewChild('tooltipTemplate', { static: true }) tooltipTemplate?: TemplateRef<unknown>;

  constructor(
    private readonly modalService: CadrartModalService,
    private readonly tooltipService: CadrartTooltipService,
    private readonly fileService: CadrartFileService,
    private readonly alertService: CadrartAlertService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();

    this.cancelAction.pipe(takeUntil(this.destroy$)).subscribe(() => this.modalService.closeModal());
    this.captureAction.pipe(takeUntil(this.destroy$)).subscribe((value) => this.save(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
  }

  private save(value: File): void {
    this.fileService.upload(value, 'test.jpg', this.config.folder ?? 'default').subscribe({
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
        folder: this.config.folder,
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

    this.fileService.delete(this.config.folder ?? 'default', value).subscribe();

    this.control.setValue(null);
  }
}
