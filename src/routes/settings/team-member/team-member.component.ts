import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';
import { EsfsFieldComponent, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartDataCardComponent } from '../../../components/data-card/data-card.component';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartTeamMemberService } from '../../../services/team-member.service';
import { CadrartTeamMemberForm } from '../../../models/team-member.form';
import { CadrartAddressPipe } from '../../../pipes/cadrart-address.pipe';
import { CadrartMailPipe } from '../../../pipes/mail.pipe';
import { CadrartPhonePipe } from '../../../pipes/phone.pipe';

@Component({
  selector: 'cadrart-route-settings-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartDataCardComponent,
    CadrartAddressPipe,
    CadrartMailPipe,
    CadrartPhonePipe,
    EsfsFormGroupDirective,
    EsfsFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteSettingsTeamMemberComponent extends CadrartSettingsPageComponent<
  ICadrartTeamMember,
  CadrartTeamMemberForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartTeamMemberService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartTeamMember): CadrartTeamMemberForm {
    return new CadrartTeamMemberForm(entity);
  }
}
