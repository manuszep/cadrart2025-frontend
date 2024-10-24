import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartIconComponent } from '../icon/icon.component';
import { CadrartCardComponent } from '../card/card.component';

import { CadrartAlertService } from './alert.service';
import { ICadrartAlert } from './alert.model';

@Component({
  selector: 'cadrart-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [CommonModule, CadrartIconComponent, CadrartCardComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.3s ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('.3s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class CadrartAlertComponent {
  constructor(public readonly service: CadrartAlertService) {}

  identifyAlert(index: number, alert: ICadrartAlert): number {
    return alert.id;
  }
}
