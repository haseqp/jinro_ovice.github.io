import { useAtomValue, useSetAtom, atom } from "jotai";
import { useParticipants } from "./useOviceObject";
import { useCallback } from "react";

const nightCountAtom = atom<number>(1);
const increaseNightCountAtom = atom(null, (_get, set) => {
  set(nightCountAtom, (prev) => prev + 1);
});
const nightCountForParticipantsAtom = atom<Array<Set<string>>>([]);

export const useNightCount = () => {
  const nightCount = useAtomValue(nightCountAtom);
  const increaseNightCount = useSetAtom(increaseNightCountAtom);
  const particpants = useParticipants();
  const setNightCountForParticipants = useSetAtom(
    nightCountForParticipantsAtom,
  );

  const setCountForId = useCallback(
    (id: string, count: number) => {
      setNightCountForParticipants((old: Array<Set<string>>) => {
        const nights = [...old];
        if (nights[count] === undefined) {
          nights[count] = new Set<string>();
        }
        nights[count].add(id);
        if (nights[count].size === particpants.length) {
          // if everyone sleeps, increase night count
          increaseNightCount();
        }
        return nights;
      });
    },
    [increaseNightCount, setNightCountForParticipants, particpants],
  );

  return { nightCount, setCountForId };
};
