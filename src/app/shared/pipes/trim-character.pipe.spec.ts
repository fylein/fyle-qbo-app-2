import { TrimCharacterPipe } from './trim-character.pipe';

describe('TrimCharacterPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimCharacterPipe();
    expect(pipe).toBeTruthy();
  });

  it('TrimCharacterPipe Transform function check',() => {
    const name = 'FyleIntegration';
    const pipe = new TrimCharacterPipe();
    expect(pipe.transform(name, 4)).toEqual('Fyle...');
  });

  it('TrimCharacterPipe Transform function check 2',() => {
    const name = 'Fyle';
    const pipe = new TrimCharacterPipe();
    expect(pipe.transform(name, 5)).toEqual(name);
  });
});
