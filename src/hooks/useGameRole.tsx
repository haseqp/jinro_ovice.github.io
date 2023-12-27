import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useMyself } from "./useOviceObject";
import { v4 as uuidv4 } from "uuid";

export interface GameRole {
  id: string;
  role: string;
  sortKey: string;
  isHost?: boolean;
  sawBySeer?: boolean;
  protectedByHunter?: boolean;
  isDead?: boolean;
  deadAt?: number;
}

const gameRolesAtom = atom<Map<string, GameRole>>(new Map());

const fillRoles = (roles: string[], role: string, roleCount: number) => {
  for (let i = 0; i < roleCount; i++) {
    for (;;) {
      const index = Math.floor(Math.random() * roles.length);
      if (roles[index] === undefined) {
        roles[index] = role;
        break;
      }
    }
  }
};

export const useGameRole = () => {
  const { myId } = useMyself();
  const [gameRoles, setGameRoles] = useAtom(gameRolesAtom);
  const [myRole, setMyRole] = useState<GameRole | undefined>(undefined);

  useEffect(() => {
    if (myId === undefined || gameRoles.size === 0) {
      return;
    }
    setMyRole(gameRoles.get(myId));
  }, [myId, gameRoles, setMyRole]);

  return { myRole, gameRoles, setGameRoles };
};

export const useGenerateGameRoles = (ids: string[]): Map<string, GameRole> => {
  const [roles, setRoles] = useState<string[]>([]);
  const [gameRoles, setGameRoles] = useState<Map<string, GameRole>>(new Map());
  const { myId } = useMyself();

  useEffect(() => {
    const count = ids.length;
    const numberOfWolves = Math.max(Math.floor(count / 3), 1);
    const numberOfVillagers = count - numberOfWolves;
    const numberOfSeers = numberOfVillagers >= 2 ? 1 : 0;
    const numberOfHunter = numberOfVillagers >= 3 ? 1 : 0;
    const roles = new Array<string>(count);
    fillRoles(roles, "wolf", numberOfWolves);
    fillRoles(roles, "seer", numberOfSeers);
    fillRoles(roles, "hunter", numberOfHunter);
    for (let i = 0; i < count; i++) {
      if (roles[i] === undefined) {
        roles[i] = "villager";
      }
    }
    setRoles(roles);
  }, [ids, setRoles]);

  useEffect(() => {
    if (ids.length !== roles.length) {
      return;
    }
    const gameRoles = new Map<string, GameRole>();
    for (let i = 0; i < ids.length; i++) {
      const gameRole = {
        id: ids[i],
        role: roles[i],
        sortKey: uuidv4(),
        isHost: ids[i] === myId,
      };
      gameRoles.set(ids[i], gameRole);
    }
    setGameRoles(gameRoles);
  }, [ids, roles, myId, setGameRoles]);

  return gameRoles;
};
