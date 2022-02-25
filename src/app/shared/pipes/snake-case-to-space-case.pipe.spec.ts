import { SnakeCaseToSpaceCase } from './snake-case-to-space-case.pipe';

describe('SnakeCaseToSpaceCase', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToSpaceCase();
    expect(pipe).toBeTruthy();
  });
});
