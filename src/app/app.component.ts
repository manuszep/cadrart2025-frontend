import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CadrartHeaderComponent } from '../components/header/header.component';
import { CadrartNavigationComponent } from '../components/navigation/navigation.component';
import { CadrartInspectorComponent } from '../components/inspector/inspector.component';
import { CadrartModalComponent } from '../components/modal/modal.component';
import { CadrartFooterComponent } from '../components/footer/footer.component';
import { CadrartAlertComponent } from '../components/alert/alert.component';
import { CadrartTooltipComponent } from '../components/tooltip/tooltip.component';

@Component({
  selector: 'cadrart-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    CadrartHeaderComponent,
    CadrartNavigationComponent,
    CadrartInspectorComponent,
    CadrartModalComponent,
    CadrartFooterComponent,
    CadrartAlertComponent,
    CadrartTooltipComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class CadrartAppComponent {}
