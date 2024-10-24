import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-actions-group',
  templateUrl: './actions-group.component.html',
  styleUrls: ['./actions-group.component.scss'],
  imports: [CommonModule, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartActionsGroupComponent {
  @Input() public editable = false;
  @Input() public deletable = false;
  @Input() public consultable = false;
  @Input() public duplicatable = false;
  @Input() public extendable = false;
  @Input() public extended = false;

  @Output() public readonly cadrartEdit = new EventEmitter<void>();
  @Output() public readonly cadrartDelete = new EventEmitter<void>();
  @Output() public readonly cadrartConsult = new EventEmitter<void>();
  @Output() public readonly cadrartDuplicate = new EventEmitter<void>();
  @Output() public readonly cadrartToggleExtend = new EventEmitter<void>();

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
