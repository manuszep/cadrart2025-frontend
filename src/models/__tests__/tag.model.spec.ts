import { CadrartTag } from '../tag.model';
describe('CadrartTag', () => {
  it('should create an instance', () => {
    const model = new CadrartTag({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartTag({} as any);
    expect(model.name).toBeNull();
    expect(model.clients).toBeNull();
  });
});
