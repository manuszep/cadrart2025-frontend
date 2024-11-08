import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { CadrartButtonComponent } from '../button/button.component';

import { CadrartButtonToggleComponent } from './button-toggle.component';

describe('CadrartButtonToggleComponent', () => {
  let component: CadrartButtonToggleComponent;
  let fixture: ComponentFixture<CadrartButtonToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), CadrartButtonToggleComponent, CadrartButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadrartButtonToggleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.cadrart-button-toggle label'));
    expect(labelElement.nativeElement.textContent).toContain('Test Label');
  });

  it('should display the correct items', () => {
    component.items = [
      {
        label: 'Item 1',
        value: '1',
        icon: 'edit'
      },
      {
        label: 'Item 2',
        value: '2',
        icon: 'check'
      }
    ];
    fixture.detectChanges();

    const itemElements = fixture.debugElement.queryAll(By.css('.cadrart-button-toggle__button'));
    expect(itemElements.length).toBe(2);
    expect(itemElements[0].nativeElement.textContent).toContain('Item 1');
    expect(itemElements[1].nativeElement.textContent).toContain('Item 2');
  });

  it('should emit change event on item click', () => {
    spyOn(component.cadrartChange, 'emit');
    component.items = [
      {
        label: 'Item 1',
        value: '1',
        icon: 'edit'
      },
      {
        label: 'Item 2',
        value: '2',
        icon: 'check'
      }
    ];
    fixture.detectChanges();

    const itemElements = fixture.debugElement.queryAll(By.css('.cadrart-button-toggle__button'));
    itemElements[0].triggerEventHandler('cadrartClick', null);

    expect(component.cadrartChange.emit).toHaveBeenCalledWith('1');
  });

  it('should apply the outline class', () => {
    component.items = [
      {
        label: 'Item 1',
        value: '1',
        icon: 'edit'
      },
      {
        label: 'Item 2',
        value: '2',
        icon: 'check'
      }
    ];
    component.outline = true;
    fixture.detectChanges();

    const toggleElement = fixture.debugElement.queryAll(By.css('.cadrart-button-toggle__button button'));
    expect(toggleElement[0].nativeElement.classList).toContain('cadrart-button--outline');
  });
});
