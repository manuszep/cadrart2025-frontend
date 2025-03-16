import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, filter, map, takeUntil } from 'rxjs';
import {
  EsfsFieldComponent,
  EsfsFormControlText,
  EsfsFormGroup,
  EsfsFormGroupDirective
} from '@manuszep/es-form-system';

import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';
import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartIconComponent } from '../icon/icon.component';
import { cadrartVersion } from '../../version';

import { CadrartNavigationService } from './navigation.service';

@Component({
  selector: 'cadrart-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartButtonComponent,
    RouterLink,
    CadrartClickOutsideDirective,
    CadrartIconComponent,
    EsfsFieldComponent,
    EsfsFormGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartNavigationComponent implements OnDestroy {
  public appVersion: string = cadrartVersion;
  public toggled: WritableSignal<boolean> = signal(false);
  public showSearch: WritableSignal<boolean> = signal(false);
  public hasSearchData: WritableSignal<boolean> = signal(true);

  public searchForm = new EsfsFormGroup(
    {
      search: new EsfsFormControlText('', {
        label: false,
        updateOn: 'change',
        required: false
      })
    },
    {},
    'FIELD',
    false
  );
  public searchStatus$ = this.searchForm.get('search')?.statusChanges;

  private unsubscribeSubject$ = new Subject<void>();

  @ViewChild('searchField', { static: true }) searchField?: EsfsFieldComponent<string>;

  constructor(
    private dataConnectorService: CadrartDataConnectorService,
    public readonly service: CadrartNavigationService,
    private readonly router: Router
  ) {
    this.dataConnectorService.data.pipe(map((data: unknown[]) => this.hasSearchData.set(data.length > 0)));

    this.searchForm
      .get('search')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((value: string | null) => {
        this.dataConnectorService.setNeedle(value ?? '');
      });

    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.searchForm.get('search')?.setValue('');
      this.toggled.set(false);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next(void 0);
    this.unsubscribeSubject$.complete();
  }

  handleClickOutside(): void {
    this.showSearch.set(false);
  }

  handleMenuToggleClick(): void {
    this.toggled.set(!this.toggled());
  }

  handleSearchClick(): void {
    this.showSearch.set(!this.showSearch());
    //this.searchField?.focus();
  }
}
