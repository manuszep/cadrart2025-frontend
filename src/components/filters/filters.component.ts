import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { CadrartButtonToggleComponent } from '../button-toggle/button-toggle.component';

import { ICadrartFilterConfig, ICadrartFilterEvent, ICadrartFiltersConfig } from './filters.model';

@Component({
  selector: 'cadrart-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  imports: [CadrartButtonToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFiltersComponent {
  @Input({ required: true }) config!: ICadrartFiltersConfig;
  @Output() public cadrartChange: EventEmitter<ICadrartFilterEvent> = new EventEmitter<ICadrartFilterEvent>();

  constructor() {}

  handleFilterChange(value: string | number, item: ICadrartFilterConfig): void {
    this.cadrartChange.emit({
      key: item.key,
      value
    });
  }
}
