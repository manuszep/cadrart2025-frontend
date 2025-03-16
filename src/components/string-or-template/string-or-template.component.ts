import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  TemplateRef,
  Type,
  ViewEncapsulation
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartDynamicComponentComponent } from '../dynamic-component/dynamic-component.component';

@Component({
  selector: 'cadrart-string-or-template',
  templateUrl: 'string-or-template.component.html',
  styleUrls: ['string-or-template.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartDynamicComponentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartStringOrTemplateComponent {
  contentAsString?: string;
  contentAsTemplate?: TemplateRef<any>;
  contentAsComponent?: Type<any>;

  @Input() inputs?: Record<string, unknown> = {};
  @Input() outputs?: Record<string, EventEmitter<unknown>> = {};
  @Input()
  set content(content: string | TemplateRef<any> | Type<any>) {
    if (typeof content === 'string') {
      this.contentAsString = content;
    } else if ((content as TemplateRef<any>).createEmbeddedView) {
      this.contentAsTemplate = content as TemplateRef<any>;
    } else {
      this.contentAsComponent = content as Type<any>;
    }
  }
}
