import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CadrartButtonComponent } from './button.component';

describe('CadrartButtonComponent', () => {
  let component: CadrartButtonComponent;
  let fixture: ComponentFixture<CadrartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadrartButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadrartButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the correct button type', () => {
    component.type = 'submit';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect((buttonElement.nativeElement as HTMLButtonElement).type).toEqual('submit');
  });

  it('should respect disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect((buttonElement.nativeElement as HTMLButtonElement).disabled).toBe(true);
  });

  it('should apply the loading class', () => {
    component.loading = true;
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--loading');
  });

  it('should display the correct icon', () => {
    component.icon = 'check';
    component.ngOnChanges();
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('cadrart-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.name).toBe('check');
  });

  it('should apply the correct icon position class', () => {
    component.icon = 'check';
    component.iconPosition = 'right';
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--icon-right');
  });

  it('should apply the icon-only class', () => {
    component.icon = 'check';
    component.iconOnly = true;
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--icon-only');
  });

  it('should apply the correct size class', () => {
    component.size = 'large';
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--large');
  });

  it('should apply the correct color class', () => {
    component.color = 'secondary';
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--secondary');
  });

  it('should apply the correct hover color class', () => {
    component.hoverColor = 'danger';
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--hover-danger');
  });

  it('should apply the outline class', () => {
    component.outline = true;
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--outline');
  });

  it('should apply the grow class', () => {
    component.grow = true;
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--grow');
  });

  it('should set the tag', () => {
    component.tag = 'test tag';
    component.ngOnChanges();
    fixture.detectChanges();

    const tagElement = fixture.debugElement.queryAll(By.css('button small'));
    expect(tagElement.length).toBe(1);
    expect(tagElement[0].nativeElement.textContent).toBe('test tag');
  });

  it('should apply the correct justify class', () => {
    component.justify = 'right';
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.classList).toContain('cadrart-button--justify-right');
  });

  it('should set the correct tabindex', () => {
    component.tabIndex = 5;
    component.ngOnChanges();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.tabIndex).toBe(5);
  });

  it('should handle hotkey', () => {
    const hotKeySpy = spyOn(component, 'handleHotKey');
    component.hotKey = 'Enter';
    component.ngOnChanges();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { code: 'Enter' });
    window.dispatchEvent(event);

    fixture.detectChanges();

    expect(hotKeySpy).toHaveBeenCalledWith(event, 'Enter');
  });

  it('hotkey should trigger event', () => {
    const clickSpy = spyOn(component.cadrartClick, 'emit');

    fixture.detectChanges();

    component.handleHotKey(new KeyboardEvent('keydown', { code: 'Enter' }), 'Enter');

    fixture.detectChanges();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should emit click event', () => {
    spyOn(component.cadrartClick, 'emit');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);

    expect(component.cadrartClick.emit).toHaveBeenCalled();
  });
});
