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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';
import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartIconComponent } from '../icon/icon.component';
import { CadrartFormControl } from '../../form-system/form-control';
import { CadrartFieldText } from '../../form-system/text/text.config';
import { CadrartFieldComponent } from '../../form-system/field/field.component';
import { cadrartVersion } from '../../version';

import { CadrartNavigationService } from './navigation.service';

@Component({
  selector: 'cadrart-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartButtonComponent,
    RouterLink,
    CadrartClickOutsideDirective,
    CadrartIconComponent,
    CadrartFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartNavigationComponent implements OnDestroy {
  public appVersion: string = cadrartVersion;
  public toggled: WritableSignal<boolean> = signal(false);
  public showSearch: WritableSignal<boolean> = signal(false);
  public hasSearchData: WritableSignal<boolean> = signal(true);

  public searchForm = new FormGroup({
    search: new CadrartFormControl(
      '',
      new CadrartFieldText({
        label: false,
        updateOn: 'change'
      })
    )
  });
  public searchStatus$ = this.searchForm.get('search')?.statusChanges;

  private unsubscribeSubject$ = new Subject<void>();

  @ViewChild('searchField', { static: true }) searchField?: CadrartFieldComponent<string, CadrartFieldText>;

  constructor(
    private dataConnectorService: CadrartDataConnectorService,
    private readonly router: Router,
    public readonly service: CadrartNavigationService
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
    this.searchField?.focus();
  }
}
