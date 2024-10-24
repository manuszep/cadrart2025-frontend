import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cadrartClickOutside]',
  standalone: true
})
export class CadrartClickOutsideDirective {
  @Output() cadrartClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: unknown) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.cadrartClickOutside.emit();
    }
  }
}
