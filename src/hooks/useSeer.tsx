import { useCallback, useEffect, useState } from "react";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { useParticipants, type Participant, useMyself } from "./useOviceObject";
import { useAtom, atom } from "jotai";

const sawParticipantsAtom = atom<string[]>([]);

export const useSeeRole = () => {
  const [sawParticipants, setSawParticipants] = useAtom(sawParticipantsAtom);
  const { gameRoles } = useGameRole();

  const seeRole = useCallback(
    (id: string) => {
      const role = gameRoles.get(id);
      if (!sawParticipants.includes(id)) {
        setSawParticipants((old) => [...old, id]);
      }
      return role?.role === "wolf" ? "wolf" : "villager";
    },
    [sawParticipants, setSawParticipants, gameRoles],
  );

  return seeRole;
};

export const useSeeableParticipants = () => {
  const { gameRoles } = useGameRole();
  const [seeableParticipants, setSeeableParticipants] = useState<Participant[]>(
    [],
  );
  const { myId } = useMyself();
  const participants = useParticipants();
  const [sawParticpants] = useAtom(sawParticipantsAtom);

  useEffect(() => {
    const seeables = new Array<Participant>();
    gameRoles?.forEach((_value: GameRole, key: string) => {
      if (key !== myId && !sawParticpants.includes(key)) {
        const found = participants.filter(
          (participant: Participant) => participant.id === key,
        )?.[0];
        if (found !== undefined) {
          seeables.push(found);
        }
      }
    });
    setSeeableParticipants(seeables);
  }, [gameRoles, myId, setSeeableParticipants, participants, sawParticpants]);

  return seeableParticipants;
};
