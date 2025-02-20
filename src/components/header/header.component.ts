
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartLoginService } from '../../services/login.service';
import { CadrartImageComponent } from '../image/image.component';

import { CadrartHeaderService } from './header.service';

@Component({
  selector: 'cadrart-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, RouterLinkActive, CadrartButtonComponent, TranslateModule, CadrartImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartHeaderComponent {
  constructor(public readonly service: CadrartHeaderService, public readonly loginService: CadrartLoginService) {}

  handleActionClick(): void {
    this.service.emitAction();
  }
}
