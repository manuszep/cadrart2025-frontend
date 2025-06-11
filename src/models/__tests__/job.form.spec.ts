import { CadrartJobForm } from '../job.form';
describe('CadrartJobForm', () => {
  it('should create an instance', () => {
    const form = new CadrartJobForm({} as any, {} as any);
    expect(form).toBeTruthy();
  });
  it('should have default count', () => {
    const form = new CadrartJobForm({} as any, {} as any);
    expect(form.get('count')?.value).toBe(1);
  });
});
