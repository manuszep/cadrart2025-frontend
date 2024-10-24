import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartProviderService } from '../../../services/provider.service';
import { CadrartFieldComponent } from '../../../form-system/field/field.component';
import { CadrartProviderForm } from '../../../models/provider.form';

@Component({
  selector: 'cadrart-route-settings-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CadrartTableComponent, CadrartFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteSettingsProviderComponent extends CadrartSettingsPageComponent<
  ICadrartProvider,
  CadrartProviderForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartProviderService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartProvider): CadrartProviderForm {
    return new CadrartProviderForm(entity);
  }
}
