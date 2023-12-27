import { useCallback } from "react";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { atom, useAtom } from "jotai";
import { useExecute } from "./useExecute";
import { useTurn } from "./useTurn";

export interface Action {
  turn: number;
  id: string;
  action: string;
  targetId: string;
}

const actionAtom = atom<Action[]>([]);

type GameRoleWithCount = {
  count: number;
} & GameRole;

const findTarget = (
  actions: Action[],
  turn: number,
  action: string,
  gameRoles: Map<string, GameRole>,
) => {
  return actions
    .filter((a: Action) => a.action === action && a.turn === turn)
    .map((a: Action) => gameRoles.get(a.targetId))
    .reduce((acc: GameRoleWithCount[], cur: GameRole | undefined) => {
      if (cur === undefined) {
        return acc;
      }
      const found = acc.find((a: GameRoleWithCount) => a.id === cur.id);
      if (found === undefined) {
        return [...acc, { ...cur, count: 1 }];
      } else {
        found.count++;
        return acc;
      }
    }, [])
    .sort((a, b) => {
      if (a?.count === b?.count) {
        return a?.sortKey.localeCompare(b?.sortKey ?? "") ?? 0;
      }
      return (b?.count ?? 0) - (a?.count ?? 0);
    })[0];
};

export const useAction = () => {
  const [, setActions] = useAtom(actionAtom);
  const { gameRoles } = useGameRole();
  const { turn, increaseTurn } = useTurn();
  const execute = useExecute();

  const act = useCallback(
    (actions: Action[], turn: number) => {
      if (gameRoles === undefined) {
        return;
      }
      const aliveCount = Array.from(gameRoles.values()).reduce((acc:number, cur: GameRole) => acc + ((cur.isDead ?? false) ? 0 : 1), 0);

      if (
        actions.filter((a: Action) => a.turn === turn).length !== aliveCount
      ) {
        return;
      }
      increaseTurn();
      const attackedByWolf = findTarget(actions, turn, "attack", gameRoles);
      const protectedByHunter = findTarget(actions, turn, "protect", gameRoles);
      const executed = findTarget(actions, turn, "vote", gameRoles);
      if (
        attackedByWolf !== undefined &&
        attackedByWolf.id !== protectedByHunter?.id
      ) {
        execute(attackedByWolf.id, turn);
      }
      if (executed !== undefined) {
        execute(executed.id, turn);
      }
    },
    [gameRoles, execute, increaseTurn],
  );

  const setActionForId = useCallback(
    (turn: number, id: string, action: string, targetId?: string) => {
      setActions((old: Action[]) => {
        if (old.filter((a: Action) => a.turn === turn && a.id === id).length !== 0) {
          return old;
        }
        const gameRole = gameRoles.get(id);
        if (gameRole?.isDead ?? false) {
          return old;
        }
        const newActions = [
        ...old,
        { action, id, turn, targetId: targetId ?? id },
        ];
        act(newActions, turn);
        return newActions;
      });
    },
    [setActions, act, gameRoles],
  );

  return { setActionForId, turn };
};
