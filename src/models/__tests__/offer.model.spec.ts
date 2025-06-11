import { CadrartOffer } from '../offer.model';
describe('CadrartOffer', () => {
  it('should create an instance', () => {
    const model = new CadrartOffer({} as any);
    expect(model).toBeTruthy();
  });
  it('should have default values for empty data', () => {
    const model = new CadrartOffer({} as any);
    expect(model.number).toBeNull();
    expect(model.client).toBeNull();
    expect(model.jobs).toBeNull();
    expect(model.total).toBeNull();
    expect(model.totalWithVat).toBeNull();
    expect(model.totalBeforeReduction).toBeNull();
  });
});
