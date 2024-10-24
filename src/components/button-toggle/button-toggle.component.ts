import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';

import { ICadrartButtonToggleItem } from './button-toggle.model';

@Component({
  selector: 'cadrart-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartButtonToggleComponent {
  @Input() public label?: string;
  @Input() public items: ICadrartButtonToggleItem[] = [];
  @Input() public outline = false;
  @Input() public value: string | number = '';

  @Output() public cadrartChange: EventEmitter<string | number> = new EventEmitter<string | number>();

  handleClick(item: ICadrartButtonToggleItem): void {
    this.value = item.value;

    this.cadrartChange.emit(item.value);
  }
}
