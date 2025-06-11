import { CadrartTagForm } from '../tag.form';
describe('CadrartTagForm', () => {
  it('should create an instance', () => {
    const form = new CadrartTagForm({} as any);
    expect(form).toBeTruthy();
  });
  it('should have default name', () => {
    const form = new CadrartTagForm({} as any);
    expect(form.get('name')?.value).toBe('');
  });
});
