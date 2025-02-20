import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';
import { cadrartAnimationSlideInOut } from '../../utils/animation';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartCardComponent } from '../card/card.component';
import { ICadrartImageParams } from '../image/image.model';

export type ICadrartDataCardField = { label: string; value?: string | null; extend?: boolean };
export type ICadrartDataCardFields = ICadrartDataCardField[];

@Component({
  selector: 'cadrart-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['./data-card.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartCardComponent, CadrartButtonComponent, CadrartClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  animations: cadrartAnimationSlideInOut
})
export class CadrartDataCardComponent {
  public extended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public deleting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public id?: number | string;
  @Input() public image?: ICadrartImageParams;
  @Input() public title?: string;
  @Input() public subtitle?: string;
  @Input() public fields?: ICadrartDataCardFields;
  @Input() public extendedFields?: ICadrartDataCardFields;
  @Input() public action?: string;
  @Input() public editable = false;
  @Input() public deletable = false;
  @Input() public consultable = false;
  @Input() public inline = false;
  @Input() public compact = false;

  @Output() public readonly cadrartAction = new EventEmitter<number | string | undefined>();
  @Output() public readonly cadrartEdit = new EventEmitter<number | string | undefined>();
  @Output() public readonly cadrartDelete = new EventEmitter<number | string | undefined>();
  @Output() public readonly cadrartConsult = new EventEmitter<number | string | undefined>();

  handleExtendClick(): void {
    this.extended$.next(!this.extended$.value);
  }

  handleActionClick(): void {
    this.cadrartAction.emit(this.id);
  }

  handleEditClick(): void {
    this.cadrartEdit.emit(this.id);
  }

  handleDeleteClick(): void {
    this.deleting$.next(true);
  }

  handleConsultClick(): void {
    this.cadrartConsult.emit(this.id);
  }

  handleDeleteCancelClick(): void {
    this.deleting$.next(false);
  }

  handleDeleteConfirmClick(): void {
    this.cadrartDelete.emit(this.id);
    this.deleting$.next(false);
  }

  handleClickOutside(): void {
    this.deleting$.next(false);
  }
}
