import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartLoginService } from '../../services/login.service';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartConnectedUserComponent } from '../connected-user/connected-user.component';

import { CadrartHeaderService } from './header.service';

@Component({
  selector: 'cadrart-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, RouterLinkActive, CadrartButtonComponent, TranslateModule, CadrartConnectedUserComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartHeaderComponent {
  constructor(public readonly service: CadrartHeaderService, public readonly loginService: CadrartLoginService) {}

  handleActionClick(): void {
    this.service.emitAction();
  }
}
