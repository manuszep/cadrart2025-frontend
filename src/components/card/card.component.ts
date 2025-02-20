import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartActionsGroupComponent } from '../actions-group/actions-group.component';
import { CadrartButtonComponent } from '../button/button.component';
import { cadrartAnimationSlideInOut } from '../../utils/animation';
import { ICadrartImageParams } from '../image/image.model';
import { CadrartImageComponent } from '../image/image.component';

@Component({
  selector: 'cadrart-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [TranslateModule, CadrartButtonComponent, CadrartActionsGroupComponent, CadrartImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  animations: cadrartAnimationSlideInOut
})
export class CadrartCardComponent {
  public extended$: WritableSignal<boolean> = signal(false);

  @Input() public title?: string;
  @Input() public subtitle?: string;
  @Input() public image?: ICadrartImageParams;
  @Input() public action?: string;
  @Input() public editable = false;
  @Input() public deletable = false;
  @Input() public consultable = false;
  @Input() public duplicatable = false;
  @Input() public showOverlay = false;
  @Input() public inline = false;
  @Input() public compact = false;
  @Input() public managedExtension = true;
  @Input() public hasError = false;
  @Input() public set extended(value: boolean) {
    if (typeof value !== 'boolean') {
      return;
    }

    this.extended$.set(value);
  }

  @Output() public readonly cadrartAction = new EventEmitter<void>();
  @Output() public readonly cadrartEdit = new EventEmitter<void>();
  @Output() public readonly cadrartDelete = new EventEmitter<void>();
  @Output() public readonly cadrartConsult = new EventEmitter<void>();
  @Output() public readonly cadrartDuplicate = new EventEmitter<void>();
  @Output() public readonly cadrartToggle = new EventEmitter<void>();

  handleExtendClick(): void {
    this.cadrartToggle.emit();

    if (this.managedExtension) {
      return;
    }

    this.extended$.set(!this.extended$());
  }

  handleActionClick(): void {
    this.cadrartAction.emit();
  }

  handleEditClick(): void {
    this.cadrartEdit.emit();
  }

  handleDeleteClick(): void {
    this.cadrartDelete.emit();
  }

  handleConsultClick(): void {
    this.cadrartConsult.emit();
  }

  handleDuplicateClick(): void {
    this.cadrartDuplicate.emit();
  }
}
