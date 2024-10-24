import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICadrartTag } from '@manuszep/cadrart2025-common';

import { CadrartDataCardComponent } from '../../../components/data-card/data-card.component';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartTagService } from '../../../services/tag.service';
import { CadrartFieldComponent } from '../../../form-system/field/field.component';
import { CadrartTagForm } from '../../../models/tag.form';

@Component({
  selector: 'cadrart-route-settings-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CadrartDataCardComponent, CadrartFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteSettingsTagComponent extends CadrartSettingsPageComponent<ICadrartTag, CadrartTagForm> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartTagService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartTag): CadrartTagForm {
    return new CadrartTagForm(entity);
  }
}
