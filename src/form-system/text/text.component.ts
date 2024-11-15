import { BehaviorSubject, combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartFieldLayoutComponent } from '../field-layout/field-layout.component';
import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldText, CadrartFieldTextOptions } from './text.config';

@Component({
  selector: 'cadrart-field-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, CadrartFieldLayoutComponent]
})
export class CadrartFieldTextComponent
  extends CadrartFieldBaseComponent<unknown, CadrartFieldText>
  implements AfterViewInit, OnDestroy
{
  public highlightedIndex: WritableSignal<number> = signal(-1);
  public label?: string;
  public placeholder?: string;
  public showOptions: WritableSignal<boolean> = signal(false);
  public options: BehaviorSubject<CadrartFieldTextOptions> = new BehaviorSubject<CadrartFieldTextOptions>([]);

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  @Output() public cadrartBlur: EventEmitter<void> = new EventEmitter<void>();

  private inputEvent: Subject<string> = new Subject();
  private unsubscribeSubject$ = new Subject<void>();

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.highlightedIndex.set(Math.min(this.highlightedIndex() + 1, this.options.value.length - 1));
    }

    if (event.key === 'ArrowUp') {
      this.highlightedIndex.set(Math.max(this.highlightedIndex() - 1, 0));
    }

    if (event.key === 'Enter') {
      if (this.highlightedIndex() === -1) {
        return;
      }

      this.handleOptionClick(this.options.value[this.highlightedIndex()]);
    }
  }

  protected override setup(): void {
    if (!this.config) {
      return;
    }

    this.label = this.config.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
    this.placeholder = this.config.placeholder ? `FIELD.${this.name.toUpperCase()}.PLACEHOLDER` : ``;

    this.setupAutoComplete();
  }

  private setupAutoComplete(): void {
    if (!this.config.options) {
      return;
    }

    const searchObservable = combineLatest([this.inputEvent.pipe(debounceTime(200)), this.config.options]);

    searchObservable.pipe(takeUntil(this.unsubscribeSubject$)).subscribe(([value, options]) => {
      this.options.next(options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())));
    });
  }

  public ngAfterViewInit(): void {
    if (this.control.value && typeof this.control.value === 'string' && !this.config.options) {
      this.inputField.nativeElement.value = this.control.value;

      return;
    }

    if (this.config.options) {
      this.config.options.pipe(takeUntil(this.unsubscribeSubject$)).subscribe((options: CadrartFieldTextOptions) => {
        if (!this.control.value) {
          return;
        }

        const option = options.find((option) => this.config.compareOptionsToValue(option, this.control.value));

        if (option) {
          this.inputField.nativeElement.value = option.label;
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject$.next(void 0);
    this.unsubscribeSubject$.complete();
  }

  public override focus(): void {
    this.inputField.nativeElement.focus();
  }

  handleFieldInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!this.config.options) {
      if (this.config.updateOn === 'change') {
        this.control.setValue(value);
      }

      return;
    }

    this.inputEvent.next(value);
    this.control.setValue('');

    this.showOptions.set(true);
  }

  handleFieldFocus(): void {
    this.showOptions.set(true);
  }

  handleFieldBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!this.config.options) {
      if (this.config.updateOn === 'blur') {
        this.control.setValue(value);
      }
    } else {
      if (this.options.value.length === 1 && this.options.value[0].label.toLowerCase() === value.toLowerCase()) {
        this.inputField.nativeElement.value = this.options.value[0].label;
        this.control.setValue(this.options.value[0].value);
      }
    }

    setTimeout(() => this.showOptions.set(false), 300);
  }

  handleOptionClick(option: { value: unknown; label: string }, e?: MouseEvent): void {
    e?.preventDefault();
    this.inputField.nativeElement.value = option.label;
    this.control.setValue(option.value);
    this.showOptions.set(false);
    this.inputEvent.next(option.label);
    this.control.updateValueAndValidity();
  }

  handleBlur(): void {
    this.cadrartBlur.emit();
  }
}
