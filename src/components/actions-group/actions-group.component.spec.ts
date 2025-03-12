import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should not emit edit event if not editable', () => {
    component.editable = false;
    spyOn(component.cadrartEdit, 'emit');
    component.handleEditClick();
    expect(component.cadrartEdit.emit).not.toHaveBeenCalled();
  });

  it('should not emit delete event if not deletable', () => {
    component.deletable = false;
    spyOn(component.cadrartDelete, 'emit');
    component.handleDeleteClick();
    expect(component.cadrartDelete.emit).not.toHaveBeenCalled();
  });

  it('should not emit consult event if not consultable', () => {
    component.consultable = false;
    spyOn(component.cadrartConsult, 'emit');
    component.handleConsultClick();
    expect(component.cadrartConsult.emit).not.toHaveBeenCalled();
  });

  it('should not emit duplicate event if not duplicatable', () => {
    component.duplicatable = false;
    spyOn(component.cadrartDuplicate, 'emit');
    component.handleDuplicateClick();
    expect(component.cadrartDuplicate.emit).not.toHaveBeenCalled();
  });

  it('should not emit toggle extend event if not extendable', () => {
    component.extendable = false;
    spyOn(component.cadrartToggleExtend, 'emit');
    component.handleToggleClick();
    expect(component.cadrartToggleExtend.emit).not.toHaveBeenCalled();
  });

  it('should toggle extended state when handleToggleClick is called', () => {
    component.extended = false;
    component.handleToggleClick();
    expect(component.extended).toBeTrue();
    component.handleToggleClick();
    expect(component.extended).toBeFalse();
  });

  it('should display the correct icon for the toggle button based on extended state', () => {
    component.extendable = true;
    component.extended = false;
    fixture.detectChanges();
    let toggleButton = fixture.debugElement.query(By.css('.cadrart-actions-group__extend'));
    expect(toggleButton.nativeElement.getAttribute('icon')).toBe('unfold_more');

    component.extended = true;
    fixture.detectChanges();
    toggleButton = fixture.debugElement.query(By.css('.cadrart-actions-group__extend'));
    expect(toggleButton.nativeElement.getAttribute('icon')).toBe('unfold_less');
  });
});
