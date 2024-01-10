import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { useMemo } from "react";

export const useWinner = () => {
  const { gameRoles } = useGameRole();

  const wolvesCount = useMemo(
    () =>
      Array.from(gameRoles.values()).reduce(
        (acc: number, cur: GameRole) =>
          acc + (cur.role === "wolf" && !(cur.isDead ?? false) ? 1 : 0),
        0,
      ),
    [gameRoles],
  );
  const aliveCount = useMemo(
    () =>
      Array.from(gameRoles.values()).reduce(
        (acc: number, cur: GameRole) => acc + (cur.isDead ?? false ? 0 : 1),
        0,
      ),
    [gameRoles],
  );

  if (wolvesCount >= aliveCount / 2) {
    return "wolf";
  }
  if (wolvesCount === 0) {
    return "villager";
  }
  return undefined;
};
