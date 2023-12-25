import { useEffect, useState, useCallback } from "react";
import type { Participant } from "./useOviceObject";
import { useParticipants, useMyself } from "./useOviceObject";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";


export const useExecute = () => {
  const { setGameRoles } = useGameRole();

  const callback = useCallback((id: string) => {
    setGameRoles((old: Map<string, GameRole>) => {
      const newMap = new Map(old);
      const role = newMap.get(id);
      if (role === undefined) {
        return old;
      }
      newMap.set(id, { ...role, isDead: true });
      return newMap;
    });
  }, [setGameRoles]);

  return callback;
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