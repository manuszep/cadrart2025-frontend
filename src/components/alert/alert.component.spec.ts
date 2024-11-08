import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartCardComponent } from '../card/card.component';
import { CadrartIconComponent } from '../icon/icon.component';

import { CadrartAlertComponent } from './alert.component';
import { CadrartAlertService } from './alert.service';

describe('CadrartAlertComponent', () => {
  let component: CadrartAlertComponent;
  let fixture: ComponentFixture<CadrartAlertComponent>;
  let service: CadrartAlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        CadrartAlertComponent,
        CadrartCardComponent,
        CadrartIconComponent
      ],
      providers: [CadrartAlertService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadrartAlertComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CadrartAlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alerts', () => {
    service.add({ type: 'success', message: 'Test Alert' });
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1);
    expect(alertElements[0].nativeElement.textContent).toContain('Test Alert');
  });

  it('should remove alert after TTL', fakeAsync(() => {
    service.add({ type: 'success', message: 'Test Alert', ttl: 1000 });
    fixture.detectChanges();

    let alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1);

    tick(1000);

    fixture.detectChanges();
    flush();

    alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(0);
  }));

  it('should display the correct icon if provided', () => {
    service.add({ type: 'success', message: 'Test Alert', icon: 'check' });
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('cadrart-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.name).toBe('check');
  });
});
