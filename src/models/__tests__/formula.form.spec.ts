import { CadrartFormulaForm } from '../formula.form';
describe('CadrartFormulaForm', () => {
  it('should create an instance', () => {
    const form = new CadrartFormulaForm({} as any);
    expect(form).toBeTruthy();
  });
  it('should have default name', () => {
    const form = new CadrartFormulaForm({} as any);
    expect(form.get('name')?.value).toBe('');
  });
});
