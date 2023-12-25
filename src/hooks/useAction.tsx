import { useCallback } from "react";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { atom, useAtom } from "jotai";

export interface Action {
  turn: number;
  id: string;
  action: string;
  targetId: string;
}

const actionAtom = atom<Action[]>([]);

const turnAtom = atom<number>(0);
const increaseTurnAtom = atom(
  (get) => get(turnAtom),
  (_get, set) => {
    set(turnAtom, (prev) => prev + 1);
  },
);

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
  const { gameRoles, setGameRoles } = useGameRole();
  const [turn, increaseTurn] = useAtom(increaseTurnAtom);

  const act = useCallback(
    (actions: Action[], turn: number) => {
      if (gameRoles === undefined) {
        return;
      }
      if (
        actions.filter((a: Action) => a.turn === turn).length !== gameRoles.size
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
        setGameRoles(
          (old: Map<string, GameRole>) =>
            new Map(
              old.set(attackedByWolf.id, { ...attackedByWolf, isDead: true }),
            ),
        );
      }
      if (executed !== undefined) {
        setGameRoles(
          (old: Map<string, GameRole>) =>
            new Map(old.set(executed.id, { ...executed, isDead: true })),
        );
      }
    },
    [gameRoles, setGameRoles, increaseTurn],
  );

  const setActionForId = useCallback(
    (turn: number, id: string, action: string, targetId?: string) => {
      setActions((old: Action[]) => {
        if (old.filter((a: Action) => a.turn === turn && a.id === id).length !== 0) {
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
    [setActions, act],
  );

  return { setActionForId, turn };
};
