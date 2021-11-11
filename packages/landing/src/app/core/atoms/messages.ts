import { atom } from 'recoil';

const initialState: string[] = [];

export const messageAtom = atom({
  key: 'MESSAGE',
  default: initialState,
});
