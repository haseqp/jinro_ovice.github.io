import { type Participant, useParticipants } from "./useOviceObject";
import { useMemo } from "react";
import { useGameRole } from "./useGameRole";

export const useWolf = () => {
  const { gameRoles } = useGameRole();

  const participants = useParticipants();

  const attackableParticipants = useMemo(
    () =>
      participants.filter(
        (participant: Participant) => {
          const gameRole = gameRoles.get(participant.id);
          return !participant.isSelf &&
            !(gameRole?.isDead ?? false) &&
            gameRole?.role !== "wolf";
        }
      ),
    [participants, gameRoles],
  );

  return attackableParticipants;
};
