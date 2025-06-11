import { TestBed } from '@angular/core/testing';
import {
  ECadrartArticleFamily,
  ECadrartArticlePriceMethod,
  ICadrartArticle,
  ICadrartFormula,
  ICadrartProvider
} from '@manuszep/cadrart2025-common';
import { EsfsFormControlDropdown, IEsfsDropdownOption } from '@manuszep/es-form-system';

import { CadrartArticleForm } from '../article.form';
import { CadrartProviderService } from '../../services/provider.service';
import { CadrartFormulaService } from '../../services/formula.service';

class MockProviderService {
  getEntitiesAsOptions(): IEsfsDropdownOption<ICadrartProvider | undefined>[] {
    return [
      { label: 'Provider 1', value: { id: 1, name: 'Provider 1' } as ICadrartProvider },
      { label: 'Provider 2', value: { id: 2, name: 'Provider 2' } as ICadrartProvider }
    ];
  }
}

class MockFormulaService {
  getEntitiesAsOptions(): IEsfsDropdownOption<ICadrartFormula | undefined>[] {
    return [
      { label: 'Formula 1', value: { id: 1, name: 'Formula 1' } as ICadrartFormula },
      { label: 'Formula 2', value: { id: 2, name: 'Formula 2' } as ICadrartFormula }
    ];
  }
}

describe('CadrartArticleForm', () => {
  let providerService: CadrartProviderService;
  let formulaService: CadrartFormulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CadrartProviderService, useClass: MockProviderService },
        { provide: CadrartFormulaService, useClass: MockFormulaService }
      ]
    });

    providerService = TestBed.inject(CadrartProviderService);
    formulaService = TestBed.inject(CadrartFormulaService);
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      const form = new CadrartArticleForm(providerService, formulaService);
      expect(form).toBeTruthy();
    });

    it('should initialize with default values when no entity is provided', () => {
      const form = new CadrartArticleForm(providerService, formulaService);

      expect(form.get('id')?.value).toBeUndefined();
      expect(form.get('name')?.value).toBe('');
      expect(form.get('place')?.value).toBe('');
      expect(form.get('buyPrice')?.value).toBe(0);
      expect(form.get('sellPrice')?.value).toBe(0);
      expect(form.get('getPriceMethod')?.value).toBe(ECadrartArticlePriceMethod.BY_LENGTH);
      expect(form.get('family')?.value).toBe(ECadrartArticleFamily.GLASS);
      expect(form.get('maxReduction')?.value).toBe(100);
      expect(form.get('provider')?.value).toBeUndefined();
      expect(form.get('formula')?.value).toBeUndefined();
      expect(form.get('providerRef')?.value).toBe('');
      expect(form.get('maxLength')?.value).toBeNull();
      expect(form.get('maxWidth')?.value).toBeNull();
      expect(form.get('combine')?.value).toBe(false);
    });

    it('should initialize with entity values when provided', () => {
      const article: Partial<ICadrartArticle> = {
        id: 123,
        name: 'Test Article',
        place: 'Shelf A',
        buyPrice: 10,
        sellPrice: 20,
        getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
        family: ECadrartArticleFamily.WOOD,
        maxReduction: 50,
        provider: { id: 1, name: 'Provider 1' } as ICadrartProvider,
        formula: { id: 1, name: 'Formula 1' } as ICadrartFormula,
        providerRef: 'PROV-123',
        maxLength: 1000,
        maxWidth: 500,
        combine: true
      };

      const form = new CadrartArticleForm(providerService, formulaService, article as ICadrartArticle);

      expect(form.get('id')?.value).toBe(123);
      expect(form.get('name')?.value).toBe('Test Article');
      expect(form.get('place')?.value).toBe('Shelf A');
      expect(form.get('buyPrice')?.value).toBe(10);
      expect(form.get('sellPrice')?.value).toBe(20);
      expect(form.get('getPriceMethod')?.value).toBe(ECadrartArticlePriceMethod.BY_AREA);
      expect(form.get('family')?.value).toBe(ECadrartArticleFamily.WOOD);
      expect(form.get('maxReduction')?.value).toBe(50);
      expect(form.get('provider')?.value).toEqual(article.provider);
      expect(form.get('formula')?.value).toEqual(article.formula);
      expect(form.get('providerRef')?.value).toBe('PROV-123');
      expect(form.get('maxLength')?.value).toBe(1000);
      expect(form.get('maxWidth')?.value).toBe(500);
      expect(form.get('combine')?.value).toBe(true);
    });
  });

  describe('form validation', () => {
    let form: CadrartArticleForm;

    beforeEach(() => {
      form = new CadrartArticleForm(providerService, formulaService);
    });

    it('should be invalid when required fields are empty', () => {
      form.get('name')?.setValue('');
      form.get('buyPrice')?.setValue(null);
      form.get('sellPrice')?.setValue(null);
      form.get('getPriceMethod')?.setValue(null);
      form.get('family')?.setValue(null);

      expect(form.valid).toBeFalse();
      expect(form.get('name')?.valid).toBeFalse();
      expect(form.get('buyPrice')?.valid).toBeFalse();
      expect(form.get('sellPrice')?.valid).toBeFalse();
      expect(form.get('getPriceMethod')?.valid).toBeFalse();
      expect(form.get('family')?.valid).toBeFalse();
    });

    it('should be valid when required fields have valid values', () => {
      form.get('name')?.setValue('Test Article');
      form.get('buyPrice')?.setValue(10);
      form.get('sellPrice')?.setValue(20);
      form.get('getPriceMethod')?.setValue(ECadrartArticlePriceMethod.BY_LENGTH);
      form.get('family')?.setValue(ECadrartArticleFamily.GLASS);

      expect(form.valid).toBeTrue();
    });

    it('should validate name length constraints', () => {
      // Too short
      form.get('name')?.setValue('A');
      expect(form.get('name')?.valid).toBeFalse();
      expect(form.get('name')?.getError('error')).toEqual('minLength');

      // Valid
      form.get('name')?.setValue('Valid Name');
      expect(form.get('name')?.valid).toBeTrue();

      // Too long
      const tooLongName = 'A'.repeat(101);
      form.get('name')?.setValue(tooLongName);
      expect(form.get('name')?.valid).toBeFalse();
      expect(form.get('name')?.getError('error')).toEqual('maxLength');
    });

    it('should validate place length constraints when provided', () => {
      // Valid when empty
      form.get('place')?.setValue('');
      expect(form.get('place')?.valid).toBeTrue();
      expect(form.get('place')?.getError('error')).toBeNull();

      // Too short when provided
      form.get('place')?.setValue('A');
      expect(form.get('place')?.valid).toBeFalse();
      expect(form.get('place')?.getError('error')).toEqual('minLength');

      // Valid
      form.get('place')?.setValue('Valid Place');
      expect(form.get('place')?.valid).toBeTrue();

      // Too long
      const tooLongPlace = 'A'.repeat(51);
      form.get('place')?.setValue(tooLongPlace);
      expect(form.get('place')?.valid).toBeFalse();
      expect(form.get('place')?.getError('error')).toEqual('maxLength');
    });

    it('should validate numeric range constraints', () => {
      // buyPrice
      form.get('buyPrice')?.setValue(-1);
      expect(form.get('buyPrice')?.valid).toBeFalse();

      form.get('buyPrice')?.setValue(100000);
      expect(form.get('buyPrice')?.valid).toBeFalse();

      form.get('buyPrice')?.setValue(50);
      expect(form.get('buyPrice')?.valid).toBeTrue();

      // sellPrice
      form.get('sellPrice')?.setValue(-1);
      expect(form.get('sellPrice')?.valid).toBeFalse();

      form.get('sellPrice')?.setValue(100000);
      expect(form.get('sellPrice')?.valid).toBeFalse();

      form.get('sellPrice')?.setValue(50);
      expect(form.get('sellPrice')?.valid).toBeTrue();

      // maxReduction
      form.get('maxReduction')?.setValue(-1);
      expect(form.get('maxReduction')?.valid).toBeFalse();

      form.get('maxReduction')?.setValue(101);
      expect(form.get('maxReduction')?.valid).toBeFalse();

      form.get('maxReduction')?.setValue(50);
      expect(form.get('maxReduction')?.valid).toBeTrue();
    });

    it('should validate providerRef length constraints when provided', () => {
      form.updateValueAndValidity();
      // Valid when empty
      form.get('providerRef')?.setValue('');
      expect(form.get('providerRef')?.valid).toBeTrue();
      expect(form.get('providerRef')?.getError('error')).toBeNull();

      // Too short when provided
      form.get('providerRef')?.setValue('A');
      expect(form.get('providerRef')?.valid).toBeFalse();
      expect(form.get('providerRef')?.getError('error')).toEqual('minLength');

      // Valid
      form.get('providerRef')?.setValue('REF-123');
      expect(form.get('providerRef')?.valid).toBeTrue();

      // Too long
      const tooLongRef = 'A'.repeat(51);
      form.get('providerRef')?.setValue(tooLongRef);
      expect(form.get('providerRef')?.valid).toBeFalse();
      expect(form.get('providerRef')?.getError('error')).toEqual('maxLength');
    });

    it('should validate maxLength and maxWidth when provided', () => {
      // Valid when null
      form.get('maxLength')?.setValue(null);
      form.get('maxWidth')?.setValue(null);
      expect(form.get('maxLength')?.valid).toBeTrue();
      expect(form.get('maxWidth')?.valid).toBeTrue();

      // Invalid values
      form.get('maxLength')?.setValue(-1);
      form.get('maxWidth')?.setValue(-1);
      expect(form.get('maxLength')?.valid).toBeFalse();
      expect(form.get('maxWidth')?.valid).toBeFalse();

      form.get('maxLength')?.setValue(10000);
      form.get('maxWidth')?.setValue(10000);
      expect(form.get('maxLength')?.valid).toBeFalse();
      expect(form.get('maxWidth')?.valid).toBeFalse();

      // Valid values
      form.get('maxLength')?.setValue(1000);
      form.get('maxWidth')?.setValue(500);
      expect(form.get('maxLength')?.valid).toBeTrue();
      expect(form.get('maxWidth')?.valid).toBeTrue();
    });
  });

  describe('dropdown options', () => {
    it('should populate dropdown options for provider', () => {
      const form = new CadrartArticleForm(providerService, formulaService);
      const providerControl = form.get('provider') as EsfsFormControlDropdown<ICadrartProvider | undefined>;

      providerControl.options.subscribe((options) => {
        expect(options).toBeTruthy();
        expect(options.length).toBe(2);
        expect(options[0].label).toBe('Provider 1');
        expect(options[1].label).toBe('Provider 2');
      });
    });

    it('should populate dropdown options for formula', () => {
      const form = new CadrartArticleForm(providerService, formulaService);
      const formulaControl = form.get('formula') as EsfsFormControlDropdown<ICadrartFormula | undefined>;

      // Handle options as an Observable
      formulaControl.options.subscribe((options) => {
        expect(options).toBeTruthy();
        expect(options.length).toBe(2);
        expect(options[0].label).toBe('Formula 1');
        expect(options[1].label).toBe('Formula 2');
      });
    });
  });
});
