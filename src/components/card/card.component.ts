import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartActionsGroupComponent } from '../actions-group/actions-group.component';
import { CadrartButtonComponent } from '../button/button.component';
import { cadrartAnimationSlideInOut } from '../../utils/animation';
import { ICadrartImageParams } from '../image/image.model';
import { CadrartImageComponent } from '../image/image.component';

@Component({
  selector: 'cadrart-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [TranslateModule, CadrartButtonComponent, CadrartActionsGroupComponent, CadrartImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: cadrartAnimationSlideInOut
})
export class CadrartCardComponent {
  public title$ = input<string>(undefined, { alias: 'title' });
  public subtitle$ = input<string>(undefined, { alias: 'subtitle' });
  public image$ = input<ICadrartImageParams>(undefined, { alias: 'image' });
  public action$ = input<string>(undefined, { alias: 'action' });
  public editable$ = input(false, { alias: 'editable' });
  public deletable$ = input(false, { alias: 'deletable' });
  public consultable$ = input(false, { alias: 'consultable' });
  public duplicatable$ = input(false, { alias: 'duplicatable' });
  public showOverlay$ = input(false, { alias: 'showOverlay' });
  public inline$ = input(false, { alias: 'inline' });
  public compact$ = input(false, { alias: 'compact' });
  public managedExtension$ = input(true, { alias: 'managedExtension' });
  public hasError$ = input(false, { alias: 'hasError' });
  public extended$ = model<boolean>(false, { alias: 'extended' });

  public cadrartAction = output<void>();
  public cadrartEdit = output<void>();
  public cadrartDelete = output<void>();
  public cadrartConsult = output<void>();
  public cadrartDuplicate = output<void>();
  public cadrartToggle = output<void>();

  handleExtendClick(): void {
    this.cadrartToggle.emit();

    if (this.managedExtension$()) {
      return;
    }

    this.extended$.update((value: boolean) => !value);
  }

  handleActionClick(): void {
    this.cadrartAction.emit();
  }

  handleEditClick(): void {
    this.cadrartEdit.emit();
  }

  handleDeleteClick(): void {
    this.cadrartDelete.emit();
  }

  handleConsultClick(): void {
    this.cadrartConsult.emit();
  }

  handleDuplicateClick(): void {
    this.cadrartDuplicate.emit();
  }
}
