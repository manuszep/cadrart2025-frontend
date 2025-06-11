import { CadrartLocationForm } from '../location.form';
describe('CadrartLocationForm', () => {
  it('should create an instance', () => {
    const form = new CadrartLocationForm({} as any);
    expect(form).toBeTruthy();
  });
  it('should have default name', () => {
    const form = new CadrartLocationForm({} as any);
    expect(form.get('name')?.value).toBe('');
  });
});
