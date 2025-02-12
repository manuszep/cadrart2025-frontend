import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { ICadrartLoginDto } from '@manuszep/cadrart2025-common';
import {
  EsfsFieldComponent,
  EsfsFormControlText,
  EsfsFormGroup,
  EsfsFormGroupDirective
} from '@manuszep/es-form-system';

import { CadrartButtonComponent } from '../../components/button/button.component';
import { CadrartLoginService } from '../../services/login.service';
import { CadrartCardComponent } from '../../components/card/card.component';
import { CadrartTeamMemberService } from '../../services/team-member.service';
import { ICadrartImageParams } from '../../components/image/image.model';

@Component({
  selector: 'cadrart-route-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartCardComponent,
    CadrartButtonComponent,
    EsfsFieldComponent,
    EsfsFormGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteLoginComponent {
  public loginForm: EsfsFormGroup = new EsfsFormGroup(
    {
      mail: new EsfsFormControlText('', { maxLength: 150, type: 'email', required: true }),
      password: new EsfsFormControlText('', { type: 'password', required: true })
    },
    {},
    'FIELD',
    false
  );
  /*public loginForm: FormGroup = new FormGroup({
    mail: new CadrartFormControl('', new CadrartFieldText({ maxLength: 150, type: 'email', required: true })),
    password: new CadrartFormControl('', new CadrartFieldText({ type: 'password', required: true }))
  });*/

  public image: WritableSignal<ICadrartImageParams> = signal({
    name: 'default',
    folder: 'team-member'
  });
  public error: WritableSignal<string | null> = signal(null);

  @Output() public readonly cadrartLogin: EventEmitter<ICadrartLoginDto> = new EventEmitter<ICadrartLoginDto>();

  constructor(
    private readonly service: CadrartLoginService,
    private readonly teamMemberService: CadrartTeamMemberService
  ) {}

  handleSubmit(): void {
    this.service
      .login(this.loginForm.value.mail, this.loginForm.value.password)
      .pipe(
        catchError(() => {
          this.error.set('ERROR.LOGIN');

          return of(false);
        })
      )
      .subscribe((res: boolean) => {
        this.error.set(res ? null : 'ERROR.LOGIN');
      });
  }

  handleMailBlur(): void {
    const mailField = this.loginForm.get('mail') as EsfsFormControlText;

    if (!mailField.value || !mailField.valid) {
      return;
    }

    this.teamMemberService
      .getEntityImageByMail(this.loginForm.value.mail)
      .subscribe((teamMember: { image: string }) => {
        if (teamMember && teamMember.image) {
          this.image.set({
            name: teamMember.image,
            folder: 'team-member'
          });
        } else {
          this.image.set({
            name: 'default',
            folder: 'team-member'
          });
        }
      });
  }
}
