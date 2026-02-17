import { ChangeDetectionStrategy, Component, inject, Signal, ViewEncapsulation } from "@angular/core";
import { ICadrartArticle } from "@manuszep/cadrart2025-common";
import { TranslateModule } from '@ngx-translate/core';

import { CadrartIconComponent } from "../../components/icon/icon.component";
import { CadrartTableValueFormatterDirective } from "../../components/table/table-value-formatter.directive";
import { CadrartTableComponent } from "../../components/table/table.component";
import { CadrartArticleService } from "../../services/article.service";
import { CadrartDataConnectorService } from "../../services/data-connector.service";

@Component({
  selector: 'cadrart-route-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  imports: [CadrartTableComponent, CadrartTableValueFormatterDirective, CadrartIconComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteStockComponent {
  protected $articlesResponse: Signal<ICadrartArticle[]>;
  protected trackBy = (_index: number, item: ICadrartArticle): number => item.id ?? 0;

  protected readonly service = inject(CadrartArticleService);
  protected readonly dataConnectorService = inject(CadrartDataConnectorService<ICadrartArticle>);

  constructor() {
    this.$articlesResponse = this.dataConnectorService.connect({
      requestor: (_page, _count, _needle, _extra) => this.service.findOutOfStock(),
      accessors: {
        // TODO: Implement accessors
      },
      showPagination: false
    });
  }
}
