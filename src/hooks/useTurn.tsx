import { atom, useAtom } from "jotai";

const turnAtom = atom<number>(0);
const increaseTurnAtom = atom(
  (get) => get(turnAtom),
  (_get, set) => {
    set(turnAtom, (prev) => prev + 1);
  },
);


export const useTurn = () => {
  const [turn, increaseTurn] = useAtom(increaseTurnAtom);

  return { turn, increaseTurn };
};


