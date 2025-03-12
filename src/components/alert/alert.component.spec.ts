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

  it('should add multiple alerts', () => {
    service.add({ type: 'success', message: 'First Alert' });
    service.add({ type: 'danger', message: 'Second Alert' });
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(2);
    expect(alertElements[0].nativeElement.textContent).toContain('First Alert');
    expect(alertElements[1].nativeElement.textContent).toContain('Second Alert');
  });

  it('should remove specific alert by id', () => {
    const id1 = service.add({ type: 'success', message: 'First Alert' });
    service.add({ type: 'danger', message: 'Second Alert' });
    fixture.detectChanges();

    service.remove(id1);
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1);
    expect(alertElements[0].nativeElement.textContent).toContain('Second Alert');
  });

  it('should handle alerts with no TTL', fakeAsync(() => {
    service.add({ type: 'success', message: 'Persistent Alert', ttl: undefined });
    fixture.detectChanges();

    let alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1);

    tick(2000); // Default TTL
    fixture.detectChanges();
    flush();

    alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1); // Alert should still be present
  }));

  it('should handle alerts with custom TTL', fakeAsync(() => {
    service.add({ type: 'success', message: 'Short-lived Alert', ttl: 500 });
    fixture.detectChanges();

    let alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(1);

    tick(500);
    fixture.detectChanges();
    flush();

    alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(0);
  }));

  it('should display alerts in the correct order', () => {
    service.add({ type: 'success', message: 'First Alert' });
    service.add({ type: 'danger', message: 'Second Alert' });
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(2);
    expect(alertElements[0].nativeElement.textContent).toContain('First Alert');
    expect(alertElements[1].nativeElement.textContent).toContain('Second Alert');
  });

  it('should handle alerts with the same message', () => {
    service.add({ type: 'success', message: 'Duplicate Alert' });
    service.add({ type: 'danger', message: 'Duplicate Alert' });
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.cadrart-alerts__alert'));
    expect(alertElements.length).toBe(2);
    expect(alertElements[0].nativeElement.textContent).toContain('Duplicate Alert');
    expect(alertElements[1].nativeElement.textContent).toContain('Duplicate Alert');
  });
});
