import { CadrartTeamMember } from '../team-member.model';
describe('CadrartTeamMember', () => {
  it('should create an instance', () => {
    const model = new CadrartTeamMember({} as any);
    expect(model).toBeTruthy();
  });
  it('should have null/default values for empty data', () => {
    const model = new CadrartTeamMember({} as any);
    expect(model.firstName).toBeNull();
    expect(model.lastName).toBeNull();
    expect(model.address).toBeNull();
    expect(model.mail).toBeNull();
    expect(model.phone).toBeNull();
    expect(model.image).toBeNull();
    expect(model.offers).toBeNull();
  });
});
