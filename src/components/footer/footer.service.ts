import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadrartFooterService {
  public content = signal<TemplateRef<any> | null>(null);
  public paginate = signal<boolean>(false);

  showFooter(content: TemplateRef<any>): void {
    this.content.set(content);
  }

  enablePagination(): void {
    this.paginate.set(true);
  }

  disablePagination(): void {
    console.log(this.content());
    this.paginate.set(false);
  }

  closeFooter(): void {
    this.content.set(null);
  }
}
