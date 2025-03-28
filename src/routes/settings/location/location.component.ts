import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICadrartLocation } from '@manuszep/cadrart2025-common';
import { EsfsFieldComponent, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartDataCardComponent } from '../../../components/data-card/data-card.component';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartLocationService } from '../../../services/location.service';
import { CadrartLocationForm } from '../../../models/location.form';

@Component({
  selector: 'cadrart-route-settings-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartDataCardComponent,
    EsfsFieldComponent,
    EsfsFormGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteSettingsLocationComponent extends CadrartSettingsPageComponent<
  ICadrartLocation,
  CadrartLocationForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService<ICadrartLocation>,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartLocationService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartLocation): CadrartLocationForm {
    return new CadrartLocationForm(entity);
  }
}
