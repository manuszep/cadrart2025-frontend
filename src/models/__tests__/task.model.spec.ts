import { CadrartTask } from '../task.model';
describe('CadrartTask', () => {
  it('should create an instance', () => {
    const model = new CadrartTask({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartTask({} as any);
    expect(model.job).toBeNull();
    expect(model.article).toBeNull();
    expect(model.comment).toBeNull();
    expect(model.image).toBeNull();
    expect(model.total).toBe(0);
    expect(model.totalBeforeReduction).toBe(0);
    expect(model.totalWithVat).toBe(0);
    expect(model.doneCount).toBe(0);
    expect(model.parent).toBeNull();
    expect(model.children).toEqual([]);
  });
});
