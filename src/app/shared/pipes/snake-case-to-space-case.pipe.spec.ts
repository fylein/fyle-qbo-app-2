import { SnakeCaseToSpaceCase } from './snake-case-to-space-case.pipe';

describe('SnakeCaseToSpaceCase', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe).toBeTruthy();
  });

  it('SnakeCaseToSpaceCasePipe Transform function check',() => {
    const name = 'Fyle_Integration_QBO';
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe.transform(name)).toEqual('Fyle Integration QBO');
  });
});
