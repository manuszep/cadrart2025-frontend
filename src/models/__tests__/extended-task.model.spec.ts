import { CadrartExtendedTask } from '../extended-task.model';
describe('CadrartExtendedTask', () => {
  it('should create an instance', () => {
    const model = new CadrartExtendedTask({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartExtendedTask({} as any);
    expect(model.taskComment).toBeNull();
    expect(model.taskTotal).toBeNull();
    expect(model.taskImage).toBeNull();
    expect(model.taskDoneCount).toBeNull();
    expect(model.parent).toBeNull();
    expect(model.jobId).toBeNull();
    expect(model.articleId).toBeNull();
    expect(model.offerId).toBeNull();
    expect(model.clientId).toBeNull();
  });
});
