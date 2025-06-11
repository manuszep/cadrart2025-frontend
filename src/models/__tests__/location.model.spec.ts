import { CadrartLocation } from '../location.model';
describe('CadrartLocation', () => {
  it('should create an instance', () => {
    const model = new CadrartLocation({} as any);
    expect(model).toBeTruthy();
  });
  it('should have default values for empty data', () => {
    const model = new CadrartLocation({} as any);
    expect(model.name).toBeNull();
    expect(model.jobs).toEqual([]);
  });
});
