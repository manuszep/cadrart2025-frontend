import { transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';
import { cadrartAnimationFlipInX, cadrartAnimationFlipOutX } from '../../utils/animation';
import { CadrartActionsGroupComponent } from '../actions-group/actions-group.component';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartIconComponent } from '../icon/icon.component';
import { CadrartConcatPipe } from '../../pipes/concat.pipe';

import { CadrartTableValueFormatterDirective } from './table-value-formatter.directive';
import { CadrartTableGetEntryNamePipe } from './table.pipe';

@Component({
  selector: 'cadrart-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    CommonModule,
    CadrartActionsGroupComponent,
    CadrartIconComponent,
    CadrartTableValueFormatterDirective,
    CadrartButtonComponent,
    TranslateModule,
    CadrartClickOutsideDirective,
    CadrartConcatPipe,
    CadrartTableGetEntryNamePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  animations: [
    trigger('existanceAnimation', [
      transition(':enter', useAnimation(cadrartAnimationFlipInX(0.75))),
      transition(':leave', useAnimation(cadrartAnimationFlipOutX(0.75)))
    ])
  ]
})
export class CadrartTableComponent<TData> {
  public deleting?: TData | false = false;

  @ContentChildren(CadrartTableValueFormatterDirective, { read: CadrartTableValueFormatterDirective })
  dataTemplates?: QueryList<CadrartTableValueFormatterDirective>;

  @Input() public data!: TData[];
  @Input() public keys!: Array<keyof TData | string>;
  @Input() public headerPrefix = 'TABLE';
  @Input() public trackBy?: (index: number, item: TData) => any;
  @Input() public getItemName: (item: TData) => string = (item: TData) => String(item);
  @Input() public deletable = true;
  @Input() public editable = true;
  @Input() public consultable = true;

  @Output() public readonly cadrartEdit = new EventEmitter<TData>();
  @Output() public readonly cadrartDelete = new EventEmitter<TData>();
  @Output() public readonly cadrartConsult = new EventEmitter<TData>();

  getTemplateOutlet(key: string | number | symbol): TemplateRef<string> | false {
    if (!this.dataTemplates) {
      return false;
    }

    return this.dataTemplates.find((template) => template.targetKey === key)?.templateRef || false;
  }

  handleEditClick(entity: TData): void {
    this.cadrartEdit.emit(entity);
  }

  handleDeleteClick(entity: TData): void {
    this.deleting = entity;
  }

  handleConsultClick(entity: TData): void {
    this.cadrartConsult.emit(entity);
  }

  identify(index: number, item: TData): any {
    return item;
  }

  handleDeleteCancelClick(): void {
    this.deleting = false;
  }

  handleDeleteConfirmClick(entity: TData): void {
    this.cadrartDelete.emit(entity);
    this.deleting = false;
  }

  handleClickOutside(entity: TData): void {
    if (entity === this.deleting) {
      this.deleting = false;
    }
  }
}
