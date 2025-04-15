import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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
  animations: cadrartAnimationSlideInOut
})
export class CadrartDataCardComponent {
  public extended$ = signal<boolean>(false);
  public deleting$ = signal<boolean>(false);

  public id$ = input<number | string>(undefined, { alias: 'id' });
  public image$ = input<ICadrartImageParams>(undefined, { alias: 'image' });
  public title$ = input<string>(undefined, { alias: 'title' });
  public subtitle$ = input<string>(undefined, { alias: 'subtitle' });
  public fields$ = input<ICadrartDataCardFields>(undefined, { alias: 'fields' });
  public extendedFields$ = input<ICadrartDataCardFields>(undefined, { alias: 'extendedFields' });
  public action$ = input<string>(undefined, { alias: 'action' });
  public editable$ = input<boolean>(false, { alias: 'editable' });
  public deletable$ = input<boolean>(false, { alias: 'deletable' });
  public consultable$ = input<boolean>(false, { alias: 'consultable' });
  public inline$ = input<boolean>(false, { alias: 'inline' });
  public compact$ = input<boolean>(false, { alias: 'compact' });

  public cadrartAction = output<number | string | undefined>();
  public cadrartEdit = output<number | string | undefined>();
  public cadrartDelete = output<number | string | undefined>();
  public cadrartConsult = output<number | string | undefined>();

  handleExtendClick(): void {
    this.extended$.update((value: boolean) => !value);
  }

  handleActionClick(): void {
    this.cadrartAction.emit(this.id$());
  }

  handleEditClick(): void {
    this.cadrartEdit.emit(this.id$());
  }

  handleDeleteClick(): void {
    this.deleting$.set(true);
  }

  handleConsultClick(): void {
    this.cadrartConsult.emit(this.id$());
  }

  handleDeleteCancelClick(): void {
    this.deleting$.set(false);
  }

  handleDeleteConfirmClick(): void {
    this.cadrartDelete.emit(this.id$());
    this.deleting$.set(false);
  }

  handleClickOutside(): void {
    this.deleting$.set(false);
  }
}
