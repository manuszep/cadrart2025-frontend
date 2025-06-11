import { CadrartProviderForm } from '../provider.form';
describe('CadrartProviderForm', () => {
  it('should create an instance', () => {
    const form = new CadrartProviderForm({} as any);
    expect(form).toBeTruthy();
  });
  it('should have default name', () => {
    const form = new CadrartProviderForm({} as any);
    expect(form.get('name')?.value).toBe('');
  });
});
