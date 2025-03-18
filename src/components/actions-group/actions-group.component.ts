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
  public editable = input<boolean>(false);
  public deletable = input<boolean>(false);
  public consultable = input<boolean>(false);
  public duplicatable = input<boolean>(false);
  public extendable = input<boolean>(false);
  public extended = input<boolean>(false);

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
