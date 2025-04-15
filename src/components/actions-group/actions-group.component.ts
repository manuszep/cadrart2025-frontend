import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';

import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-actions-group',
  templateUrl: './actions-group.component.html',
  styleUrls: ['./actions-group.component.scss'],
  imports: [CadrartButtonComponent],
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

  public readonly cadrartEdit = output<void>();
  public readonly cadrartDelete = output<void>();
  public readonly cadrartConsult = output<void>();
  public readonly cadrartDuplicate = output<void>();
  public readonly cadrartToggleExtend = output<void>();

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
}
