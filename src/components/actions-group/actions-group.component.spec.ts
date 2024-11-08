import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CadrartButtonComponent } from '../button/button.component';

import { CadrartActionsGroupComponent } from './actions-group.component';

describe('CadrartActionsGroupComponent', () => {
  let component: CadrartActionsGroupComponent;
  let fixture: ComponentFixture<CadrartActionsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadrartActionsGroupComponent, CadrartButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadrartActionsGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event', () => {
    spyOn(component.cadrartEdit, 'emit');
    component.handleEditClick();
    expect(component.cadrartEdit.emit).toHaveBeenCalled();
  });

  it('should emit delete event', () => {
    spyOn(component.cadrartDelete, 'emit');
    component.handleDeleteClick();
    expect(component.cadrartDelete.emit).toHaveBeenCalled();
  });

  it('should emit consult event', () => {
    spyOn(component.cadrartConsult, 'emit');
    component.handleConsultClick();
    expect(component.cadrartConsult.emit).toHaveBeenCalled();
  });

  it('should emit duplicate event', () => {
    spyOn(component.cadrartDuplicate, 'emit');
    component.handleDuplicateClick();
    expect(component.cadrartDuplicate.emit).toHaveBeenCalled();
  });

  it('should emit toggle extend event', () => {
    spyOn(component.cadrartToggleExtend, 'emit');
    component.handleToggleClick();
    expect(component.cadrartToggleExtend.emit).toHaveBeenCalled();
  });

  it('should display the correct elements based on inputs', () => {
    component.editable = true;
    component.deletable = true;
    component.consultable = true;
    component.duplicatable = true;
    component.extendable = true;

    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('.cadrart-actions-group__edit'));
    const deleteButton = fixture.debugElement.query(By.css('.cadrart-actions-group__delete'));
    const consultButton = fixture.debugElement.query(By.css('.cadrart-actions-group__consult'));
    const duplicateButton = fixture.debugElement.query(By.css('.cadrart-actions-group__duplicate'));
    const toggleButton = fixture.debugElement.query(By.css('.cadrart-actions-group__extend'));

    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(consultButton).toBeTruthy();
    expect(duplicateButton).toBeTruthy();
    expect(toggleButton).toBeTruthy();
  });

  it('should not display elements when inputs are false', () => {
    component.editable = false;
    component.deletable = false;
    component.consultable = false;
    component.duplicatable = false;
    component.extendable = false;

    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('.edit-button'));
    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    const consultButton = fixture.debugElement.query(By.css('.consult-button'));
    const duplicateButton = fixture.debugElement.query(By.css('.duplicate-button'));
    const toggleButton = fixture.debugElement.query(By.css('.toggle-button'));

    expect(editButton).toBeNull();
    expect(deleteButton).toBeNull();
    expect(consultButton).toBeNull();
    expect(duplicateButton).toBeNull();
    expect(toggleButton).toBeNull();
  });
});
