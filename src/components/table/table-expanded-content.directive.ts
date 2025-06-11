import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cadrartTableExpanded]'
})
export class CadrartTableExpandedContentDirective {
  constructor(public readonly templateRef: TemplateRef<any>) {}
}
