import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartHeaderService } from '../../components/header/header.service';

@Component({
  selector: 'cadrart-route-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [RouterModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteSettingsComponent implements OnDestroy {
  constructor(private readonly headerService: CadrartHeaderService) {
    this.headerService.setNavigation([
      { label: 'Articles', path: '/settings/articles' },
      { label: 'Clients', path: '/settings/clients' },
      { label: 'Formules', path: '/settings/formulas' },
      { label: 'Emplacements', path: '/settings/locations' },
      { label: 'Fournisseurs', path: '/settings/providers' },
      { label: 'Tags', path: '/settings/tags' },
      { label: 'Equipe', path: '/settings/team-members' }
    ]);

    this.headerService.setAction({ label: 'ADD', icon: 'add', tag: 'Alt + N', hotkey: 'alt.n' });
  }

  ngOnDestroy(): void {
    this.headerService.clearNavigation();
    this.headerService.clearAction();
  }
}
