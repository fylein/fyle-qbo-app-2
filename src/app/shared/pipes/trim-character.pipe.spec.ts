import { TrimCharacterPipe } from './trim-character.pipe';

describe('TrimCharacterPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimCharacterPipe();
    expect(pipe).toBeTruthy();
  });

  it('TrimCharacterPipe Transform function check', () => {
    const name = 'Fyle for Automated Testing Webapp Testing';
    const pipe = new TrimCharacterPipe();
    expect(pipe.transform(name, 4)).toEqual('Fyle...');
  });

  it('TrimCharacterPipe Transform function check 2', () => {
    const name = 'Fyle for Automated Testing Webapp Testing';
    const pipe = new TrimCharacterPipe();
    expect(pipe.transform(name, 45)).toEqual(name);
  });
});
