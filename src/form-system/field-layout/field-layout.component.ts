import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { CadrartIconComponent } from '../../components/icon/icon.component';
import { ICadrartIcon } from '../../components/icon/icon.model';

@Component({
  selector: 'cadrart-field-layout',
  templateUrl: './field-layout.component.html',
  styleUrls: ['./field-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, TranslateModule, CadrartIconComponent]
})
export class CadrartFieldLayoutComponent {
  public hasValue = false;

  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() iconBefore?: ICadrartIcon;
  @Input() iconAfter?: ICadrartIcon;
  @Input() textAfter?: string;
  @Input() disabled = false;
  @Input()
  set value(value: unknown) {
    this.hasValue = !!value;
  }
}
