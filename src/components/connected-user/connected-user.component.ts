import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';
import { CadrartLoginService } from '../../services/login.service';
import { CadrartButtonComponent } from '../button/button.component';
import { DeploymentIndicatorComponent } from '../deployment-indicator/deployment-indicator.component';
import { CadrartImageComponent } from '../image/image.component';

@Component({
  selector: 'cadrart-connected-user',
  templateUrl: './connected-user.component.html',
  styleUrls: ['./connected-user.component.scss'],
  imports: [
    CadrartButtonComponent,
    TranslateModule,
    CadrartImageComponent,
    DeploymentIndicatorComponent,
    CadrartClickOutsideDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartConnectedUserComponent {
  public isDropdownOpen = signal(false);

  constructor(public readonly loginService: CadrartLoginService) {}

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  handleLogout(): void {
    this.loginService.logout();
    this.closeDropdown();
  }
}
