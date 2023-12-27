import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useExecutables, useExecute, useLastExecuted } from './useExecute';
import { useSetAtom, Provider } from 'jotai';
import { useGameRole } from './useGameRole';
import { participantsAtom } from './useOviceObject';
import { useTurn } from './useTurn';
import type { ReactNode } from 'react';

describe('useExecute', () => {
  const setup = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );

    const hook = renderHook(() => {
      const setParticipants = useSetAtom(participantsAtom);
      const { setGameRoles } = useGameRole();
      const executables = useExecutables();
      const execute = useExecute();
      const lastExecuted = useLastExecuted();
      const { increaseTurn} = useTurn();

      return { setParticipants, setGameRoles, executables, execute, lastExecuted, increaseTurn };
    }, { wrapper });
    hook.result.current.setParticipants([
      { name: "A", id: "1", avatar_url: "", isSelf: true },
      { name: "B", id: "2", avatar_url: "", isSelf: false },
      { name: "C", id: "3", avatar_url: "", isSelf: false },
    ]);
    hook.result.current.setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1" }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3" }],
      ]),
    );
    hook.rerender();
    return hook;
  };
  it('should return executables aside from myself', () => {
    const hook = setup();
    expect(hook.result.current.executables).toMatchObject([
      {id: "2"},
      {id: "3"},
    ]);
  });
  it ('should return executables aside from myself and dead', () => {
    const hook = setup();
    hook.result.current.execute("3", 0);
    hook.rerender();
    expect(hook.result.current.executables).toMatchObject([
      {id: "2"},
    ]);
  });
  it ('should be undefiend if no one is dead yet', () => {
    const hook = setup();
    hook.rerender();
    expect(hook.result.current.lastExecuted).toBeUndefined();
  });
  it ('should return lastExecuted', () => {
    const hook = setup();
    hook.rerender();
    hook.result.current.execute("3", 0);
    hook.result.current.increaseTurn();
    hook.rerender();

    expect(hook.result.current.lastExecuted).toMatchObject({id: "3"});
  });
  it ('should return undefined if no one is executed', () => {
    const hook = setup();
    hook.rerender();
    hook.result.current.execute("3", 0);
    hook.result.current.increaseTurn();
    hook.rerender();
    hook.result.current.increaseTurn();
    hook.rerender();

    expect(hook.result.current.lastExecuted).toBeUndefined();
  });
});