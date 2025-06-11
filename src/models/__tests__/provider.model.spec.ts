import { CadrartProvider } from '../provider.model';
describe('CadrartProvider', () => {
  it('should create an instance', () => {
    const model = new CadrartProvider({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartProvider({} as any);
    expect(model.name).toBeNull();
    expect(model.address).toBeNull();
    expect(model.vat).toBeNull();
    expect(model.iban).toBeNull();
    expect(model.mail).toBeNull();
    expect(model.articles).toBeNull();
  });
});
