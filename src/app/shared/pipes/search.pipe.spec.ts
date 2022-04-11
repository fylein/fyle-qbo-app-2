import { SearchPipe } from './search.pipe';

describe('SearchPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchPipe();
    expect(pipe).toBeTruthy();
  });

  it('SearchPipe Transform function check', () => {
    const names = 'FyleIntegrations'
    const pipe = new SearchPipe();
    expect(pipe.transform(names)).toEqual("FyleIntegrations");
  });
});
