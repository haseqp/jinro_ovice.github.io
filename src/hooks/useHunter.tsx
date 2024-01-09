import { useMemo, useCallback } from "react";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { useParticipants, type Participant, useMyself } from "./useOviceObject";
import { useAtom, atom } from "jotai";

const protectedParticipantsAtom = atom<string[]>([]);

export const useHunter = () => {
  const { gameRoles } = useGameRole();
  const { myId } = useMyself();
  const participants = useParticipants();
  const [protectedParticipants, setProtectedParticipants] = useAtom(protectedParticipantsAtom);

  const protectableParticipants = useMemo(() => {
    const protectables = new Array<Participant>();
    gameRoles?.forEach((_value: GameRole, key: string) => {
      if (key !== myId && !protectedParticipants.includes(key) && !(gameRoles.get(key)?.isDead ?? false)) {
        const found = participants.filter(
          (participant: Participant) => participant.id === key,
        )?.[0];
        if (found !== undefined) {
          protectables.push(found);
        }
      }
    });
    return protectables;
  }, [gameRoles, myId, participants, protectedParticipants]);

  const protect = useCallback((id:string) => {
    if (protectableParticipants.find((participant) => participant.id === id) === undefined) {
      return;
    } 
    setProtectedParticipants((old) => {
      if (old.includes(id)) {
        return old;
      }
      return [...old, id];
    });

  }, [protectableParticipants, setProtectedParticipants]);

  return { protectableParticipants, protect };
};
