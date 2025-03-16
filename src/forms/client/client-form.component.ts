import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { EsfsFieldComponent, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartClientForm } from '../../models/client.form';

@Component({
  selector: 'cadrart-client-form',
  templateUrl: './client-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [EsfsFieldComponent, EsfsFormGroupDirective]
})
export class CadrartClientFormComponent {
  @Input({ required: true }) entityFormGroup!: CadrartClientForm;
}
