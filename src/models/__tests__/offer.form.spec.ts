import { CadrartOfferForm } from '../offer.form';
describe('CadrartOfferForm', () => {
  it('should create an instance', () => {
    const form = new CadrartOfferForm({} as any, {} as any, {} as any, {} as any);
    expect(form).toBeTruthy();
  });
  it('should have default total', () => {
    const form = new CadrartOfferForm({} as any, {} as any, {} as any, {} as any);
    expect(form.get('total')?.value).toBe(0);
  });
});
