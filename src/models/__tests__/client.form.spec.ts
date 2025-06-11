import { TestBed } from '@angular/core/testing';
import { IEsfsDropdownOption } from '@manuszep/es-form-system';
import { ICadrartTag, ICadrartClient } from '@manuszep/cadrart2025-common';

import { CadrartTagService } from '../../services/tag.service';
import { CadrartClientForm } from '../client.form';

class MockTagService {
  getEntitiesAsOptions(): IEsfsDropdownOption<ICadrartTag | undefined>[] {
    return [
      { label: 'Tag 1', value: { id: 1, name: 'Tag 1', clients: [] } as ICadrartTag },
      { label: 'Tag 2', value: { id: 2, name: 'Tag 2', clients: [] } as ICadrartTag }
    ];
  }
}

describe('CadrartClientForm', () => {
  let tagService: CadrartTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CadrartTagService, useClass: MockTagService }]
    });
    tagService = TestBed.inject(CadrartTagService);
  });

  it('should create an instance', () => {
    const form = new CadrartClientForm(tagService);
    expect(form).toBeTruthy();
  });

  it('should have default values', () => {
    const form = new CadrartClientForm(tagService);
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('company')?.value).toBe('');
    expect(form.get('address')?.value).toBeDefined();
    expect(form.get('mail')?.value).toBe('');
    expect(form.get('phone')?.value).toBe('');
    expect(form.get('phone2')?.value).toBe('');
    expect(form.get('vat')?.value).toBe(21);
    expect(form.get('tag')?.value).toBeUndefined();
    expect(form.get('reduction')?.value).toBe(0);
  });

  it('should initialize with entity values', () => {
    const entity: ICadrartClient = {
      id: 42,
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme',
      address: 'Rue haute 1, 1000 bruxelles',
      mail: 'john@doe.com',
      phone: '123456',
      phone2: '654321',
      vat: 10,
      tag: { id: 1, name: 'Tag 1', clients: [] },
      reduction: 15
    };
    const form = new CadrartClientForm(tagService, entity);
    expect(form.get('firstName')?.value).toBe('John');
    expect(form.get('lastName')?.value).toBe('Doe');
    expect(form.get('company')?.value).toBe('Acme');
    expect(form.get('address')?.value).toEqual({ street: 'Main', country: 'BE' });
    expect(form.get('mail')?.value).toBe('john@doe.com');
    expect(form.get('phone')?.value).toBe('123456');
    expect(form.get('phone2')?.value).toBe('654321');
    expect(form.get('vat')?.value).toBe(10);
    expect(form.get('tag')?.value).toEqual({ id: 1, name: 'Tag 1', clients: [] });
    expect(form.get('reduction')?.value).toBe(15);
  });

  describe('validation', () => {
    let form: CadrartClientForm;
    beforeEach(() => {
      form = new CadrartClientForm(tagService);
    });

    it('should be invalid when required fields are empty', () => {
      form.get('firstName')?.setValue('');
      form.get('lastName')?.setValue('');
      form.get('vat')?.setValue(null);
      form.get('reduction')?.setValue(null);
      expect(form.valid).toBeFalse();
      expect(form.get('firstName')?.valid).toBeFalse();
      expect(form.get('lastName')?.valid).toBeFalse();
      expect(form.get('vat')?.valid).toBeFalse();
      expect(form.get('reduction')?.valid).toBeFalse();
    });

    it('should be valid when required fields are set', () => {
      form.get('firstName')?.setValue('Jane');
      form.get('lastName')?.setValue('Smith');
      form.get('vat')?.setValue(21);
      form.get('reduction')?.setValue(10);
      expect(form.valid).toBeTrue();
    });

    it('should validate min/max length for names', () => {
      form.get('firstName')?.setValue('A');
      expect(form.get('firstName')?.valid).toBeFalse();
      form.get('firstName')?.setValue('A'.repeat(51));
      expect(form.get('firstName')?.valid).toBeFalse();
      form.get('firstName')?.setValue('Anna');
      expect(form.get('firstName')?.valid).toBeTrue();
      form.get('lastName')?.setValue('B');
      expect(form.get('lastName')?.valid).toBeFalse();
      form.get('lastName')?.setValue('B'.repeat(51));
      expect(form.get('lastName')?.valid).toBeFalse();
      form.get('lastName')?.setValue('Brown');
      expect(form.get('lastName')?.valid).toBeTrue();
    });

    it('should validate company min/max length if provided', () => {
      form.get('company')?.setValue('C');
      expect(form.get('company')?.valid).toBeFalse();
      form.get('company')?.setValue('C'.repeat(51));
      expect(form.get('company')?.valid).toBeFalse();
      form.get('company')?.setValue('Company');
      expect(form.get('company')?.valid).toBeTrue();
      form.get('company')?.setValue('');
      expect(form.get('company')?.valid).toBeTrue();
    });

    it('should validate mail and phone types and lengths', () => {
      form.get('mail')?.setValue('not-an-email');
      expect(form.get('mail')?.valid).toBeFalse();
      form.get('mail')?.setValue('a@b.com');
      expect(form.get('mail')?.valid).toBeTrue();
      form.get('mail')?.setValue('a'.repeat(256) + '@b.com');
      expect(form.get('mail')?.valid).toBeFalse();
      form.get('phone')?.setValue('1');
      expect(form.get('phone')?.valid).toBeFalse();
      form.get('phone')?.setValue('1'.repeat(21));
      expect(form.get('phone')?.valid).toBeFalse();
      form.get('phone')?.setValue('0123456789');
      expect(form.get('phone')?.valid).toBeTrue();
    });

    it('should validate reduction and vat numeric constraints', () => {
      form.get('reduction')?.setValue(-1);
      expect(form.get('reduction')?.valid).toBeFalse();
      form.get('reduction')?.setValue(101);
      expect(form.get('reduction')?.valid).toBeFalse();
      form.get('reduction')?.setValue(50);
      expect(form.get('reduction')?.valid).toBeTrue();
      form.get('vat')?.setValue(null);
      expect(form.get('vat')?.valid).toBeFalse();
      form.get('vat')?.setValue(21);
      expect(form.get('vat')?.valid).toBeTrue();
    });
  });

  it('should provide tag dropdown options', () => {
    const form = new CadrartClientForm(tagService);
    const tagControl = form.get('tag');
    expect(tagControl).not.toBeNull();
    if (tagControl) {
      expect(tagControl.options).toBeDefined();
      const options = tagControl.options;
      expect(Array.isArray(options)).toBeTrue();
      expect(options.length).toBe(2);
      expect(options[0].label).toBe('Tag 1');
      expect(options[1].label).toBe('Tag 2');
    }
  });

  it('should serialize address as JSON in getRawValue', () => {
    const form = new CadrartClientForm(tagService);
    form.get('address')?.setValue({ street: 'Rue', country: 'BE' });
    const raw = form.getRawValue();
    expect(typeof raw.address).toBe('string');
    expect(raw.address).toContain('Rue');
  });
});
