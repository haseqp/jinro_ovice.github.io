import { useEffect, useState, useCallback, useMemo } from "react";
import type { Participant } from "./useOviceObject";
import { useParticipants, useMyself, useFindParticipantById } from "./useOviceObject";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { useTurn } from "./useTurn";


export const useExecute = () => {
  const { setGameRoles } = useGameRole();

  const callback = useCallback((id: string, turn: number) => {
    setGameRoles((old: Map<string, GameRole>) => {
      const newMap = new Map(old);
      const role = newMap.get(id);
      if (role === undefined) {
        return old;
      }
      newMap.set(id, { ...role, isDead: true, deadAt: turn });
      return newMap;
    });
  }, [setGameRoles]);

  return callback;
};

export const useLastExecuted = () => {
  const { gameRoles } = useGameRole();
  const { turn } = useTurn();

  const findParticipantById = useFindParticipantById();

  const lastDead = useMemo(() => Array.from(gameRoles?.values()).filter((a) => a.deadAt === turn -1)?.[0], [gameRoles, turn]);
  const lastDeadParticipant = useMemo(() => lastDead === undefined ? undefined : findParticipantById(lastDead.id), [findParticipantById, lastDead]);

  return lastDeadParticipant;
};


export const useExecutables = () => {
  const [ executables, setExecutables ] = useState<Participant[]>([]);
  const { gameRoles } = useGameRole();
  const participants = useParticipants();
  const { myId } = useMyself();

  useEffect(() => {
    const alives = (Array.from(gameRoles.values()).filter((role) => !(role.isDead ?? false))
    .map((role) => participants.find((participant: Participant) => participant.id === role.id))
    .filter((participant: Participant|undefined) => participant !== undefined) as Participant[])
    .filter((participant: Participant) => participant.id !== myId);
    
    setExecutables(alives);
  }, [gameRoles, participants, myId]);

  return executables;
};