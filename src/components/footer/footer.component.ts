import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';

import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';
import { CadrartPaginationComponent } from '../pagination/pagination.component';

import { CadrartFooterService } from './footer.service';

@Component({
  selector: 'cadrart-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, CadrartStringOrTemplateComponent, CadrartPaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartFooterComponent {
  public templateData: Observable<{
    content: TemplateRef<unknown> | null;
    paginate: boolean;
  }>;

  constructor(public readonly service: CadrartFooterService) {
    this.templateData = combineLatest([this.service.content$, this.service.paginate$]).pipe(
      map(([content, paginate]) => ({
        content,
        paginate
      }))
    );
  }
}
