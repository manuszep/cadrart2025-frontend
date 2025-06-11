import { CadrartTeamMemberForm } from '../team-member.form';
describe('CadrartTeamMemberForm', () => {
  it('should create an instance', () => {
    const form = new CadrartTeamMemberForm({} as any);
    expect(form).toBeTruthy();
  });
  it('should have default firstName', () => {
    const form = new CadrartTeamMemberForm({} as any);
    expect(form.get('firstName')?.value).toBe('');
  });
});
