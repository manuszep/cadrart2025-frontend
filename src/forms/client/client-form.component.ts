import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CadrartFieldComponent } from '../../form-system/field/field.component';

@Component({
  selector: 'cadrart-client-form',
  templateUrl: './client-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ReactiveFormsModule, CadrartFieldComponent]
})
export class CadrartClientFormComponent {
  @Input({ required: true }) entityFormGroup!: FormGroup;
}
