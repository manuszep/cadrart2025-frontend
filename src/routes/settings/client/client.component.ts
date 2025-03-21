import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICadrartClient } from '@manuszep/cadrart2025-common';

import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartClientService } from '../../../services/client.service';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartClientFormComponent } from '../../../forms/client/client-form.component';
import { CadrartClientForm } from '../../../models/client.form';
import { CadrartTagService } from '../../../services/tag.service';
import { CadrartAddressPipe } from '../../../pipes/cadrart-address.pipe';
import { CadrartMailPipe } from '../../../pipes/mail.pipe';
import { CadrartPhonePipe } from '../../../pipes/phone.pipe';

@Component({
  selector: 'cadrart-route-settings-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartAddressPipe,
    CadrartClientFormComponent,
    CadrartMailPipe,
    CadrartPhonePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteSettingsClientComponent extends CadrartSettingsPageComponent<
  ICadrartClient,
  CadrartClientForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService<ICadrartClient>,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartClientService,
    protected readonly tagService: CadrartTagService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartClient): CadrartClientForm {
    return new CadrartClientForm(this.tagService, entity);
  }
}
