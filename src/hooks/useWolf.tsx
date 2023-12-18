import { useAtom, atom } from "jotai";
import { type Participant, useParticipants } from "./useOviceObject";
import { useCallback, useMemo } from "react";
import { useGameRole } from "./useGameRole";

const attackedParticipantsAtom = atom<Participant[]>([]);

export const useWolf = () => {
  const [attackedParticipants, setAttackParticipants] = useAtom(
    attackedParticipantsAtom,
  );
  const { gameRoles } = useGameRole();

  const participants = useParticipants();

  const attack = useCallback(
    (id: string) => {
      const participant = participants.find(
        (participant: Participant) => participant.id === id,
      );
      if (participant !== undefined) {
        setAttackParticipants((old: Participant[]) => [...old, participant]);
      }
    },
    [setAttackParticipants, participants],
  );

  const attackableParticipants = useMemo(
    () =>
      participants.filter(
        (participant: Participant) =>
          !participant.isSelf &&
          !attackedParticipants.includes(participant) &&
          gameRoles.get(participant.id)?.role !== "wolf",
      ),
    [participants, attackedParticipants, gameRoles],
  );

  return { attack, attackableParticipants };
};
