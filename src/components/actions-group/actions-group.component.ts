import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';

import { IActionsGroupAction } from './actions-group.model';

@Component({
  selector: 'cadrart-actions-group',
  templateUrl: './actions-group.component.html',
  styleUrls: ['./actions-group.component.scss'],
  imports: [CadrartButtonComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartActionsGroupComponent {
  public editable$ = input<boolean>(false, { alias: 'editable' });
  public deletable$ = input<boolean>(false, { alias: 'deletable' });
  public consultable$ = input<boolean>(false, { alias: 'consultable' });
  public duplicatable$ = input<boolean>(false, { alias: 'duplicatable' });
  public extendable$ = input<boolean>(false, { alias: 'extendable' });
  public extended$ = input<boolean>(false, { alias: 'extended' });
  public customActions$ = input<Array<IActionsGroupAction<any>>>([] as Array<IActionsGroupAction<unknown>>, {
    alias: 'customActions'
  });

  public readonly cadrartEdit = output<void>();
  public readonly cadrartDelete = output<void>();
  public readonly cadrartConsult = output<void>();
  public readonly cadrartDuplicate = output<void>();
  public readonly cadrartToggleExtend = output<void>();
  public readonly cadrartCustom = output<(data: any) => void>();

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

  handleToggleClick(): void {
    this.cadrartToggleExtend.emit();
  }

  handleCustomActionClick(action: IActionsGroupAction<any>): void {
    this.cadrartCustom.emit(action.action);
  }
}
