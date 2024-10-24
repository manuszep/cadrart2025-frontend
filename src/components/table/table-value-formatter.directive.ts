import { Directive, ElementRef, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cadrartTableValueFormatter]',
  standalone: true
})
export class CadrartTableValueFormatterDirective {
  public targetKey = '';

  @Input('cadrartTableValueFormatter') set name(name: string) {
    this.targetKey = name;
  }

  get name(): string {
    return this.targetKey;
  }

  constructor(public readonly elementRef: ElementRef, public readonly templateRef: TemplateRef<string>) {}
}
