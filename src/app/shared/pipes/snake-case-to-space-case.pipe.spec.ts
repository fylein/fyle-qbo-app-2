import { SnakeCaseToSpaceCase } from './snake-case-to-space-case.pipe';

describe('SnakeCaseToSpaceCase', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe).toBeTruthy();
  });

  it('SnakeCaseToSpaceCasePipe Transform function check',() => {
    const name = 'CORPORATE_CARD';
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe.transform(name)).toEqual('CORPORATE CARD');
  });

  it('SnakeCaseToSpaceCasePipe Transform function check 2',() => {
    const name = 22;
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe.transform(name)).toEqual('');
  });
});
