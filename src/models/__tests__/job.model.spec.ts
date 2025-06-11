import { CadrartJob } from '../job.model';
describe('CadrartJob', () => {
  it('should create an instance', () => {
    const model = new CadrartJob({} as any);
    expect(model).toBeTruthy();
  });
  it('should have default values for empty data', () => {
    const model = new CadrartJob({} as any);
    expect(model.count).toBe(1);
    expect(model.tasks).toEqual([]);
    expect(model.total).toBe(0);
    expect(model.totalWithVat).toBe(0);
    expect(model.totalBeforeReduction).toBe(0);
  });
});
