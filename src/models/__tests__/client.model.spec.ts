import { CadrartClient } from '../client.model';
describe('CadrartClient', () => {
  it('should create an instance', () => {
    const model = new CadrartClient({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartClient({} as any);
    expect(model.firstName).toBeNull();
    expect(model.lastName).toBeNull();
    expect(model.company).toBeNull();
    expect(model.address).toBeNull();
    expect(model.mail).toBeNull();
    expect(model.phone).toBeNull();
    expect(model.phone2).toBeNull();
    expect(model.vat).toBeNull();
    expect(model.reduction).toBe(0);
    expect(model.offers).toBeNull();
  });
});
