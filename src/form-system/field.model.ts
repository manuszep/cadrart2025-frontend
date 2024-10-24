import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CadrartField, ICadrartFieldConfig } from './field-config.model';
import { CadrartFormControl } from './form-control';

@Component({
  selector: 'cadrart-field-base',
  template: ''
})
export abstract class CadrartFieldBaseComponent<TValue, TConfig extends CadrartField<ICadrartFieldConfig>>
  implements OnInit
{
  @Input({ required: true }) config!: TConfig;
  @Input({ required: true }) control!: CadrartFormControl<TValue | null, TConfig>;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) form!: FormGroup;

  @Output() cadrartChange: EventEmitter<TValue | null> = new EventEmitter<TValue | null>();

  ngOnInit(): void {
    if (!this.config || !this.name || !this.control) {
      throw new Error('CadrartFieldComponent: config, name and control are required');
    }

    this.setup();
  }

  protected setup(): void {
    // Override in child classes
  }

  focus(): void {
    // Override in child classes
  }
}
