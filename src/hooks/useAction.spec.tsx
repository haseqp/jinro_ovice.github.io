import { describe, it, expect } from "vitest";
import { useAction } from "./useAction";
import { useGameRole } from "./useGameRole";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "jotai";
import type { ReactNode } from "react";

describe("useNightAction", () => {
  const setup = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );
    const hook = renderHook(
      () => {
        const { gameRoles, setGameRoles } = useGameRole();
        const { setActionForId, act, turn } = useAction();

        return { gameRoles, setGameRoles, setActionForId, act, turn };
      },
      { wrapper },
    );
    act(() => {
      hook.result.current.setGameRoles(
        new Map([
          ["1", { id: "1", role: "wolf", sortKey: "1", isHost: true }],
          ["2", { id: "2", role: "villager", sortKey: "2" }],
          ["3", { id: "3", role: "villager", sortKey: "3" }],
          ["4", { id: "4", role: "hunter", sortKey: "4" }],
        ]),
      );
    });
    return hook;
  };
  it("should be attacked", () => {
    const hook = setup();
    hook.result.current.setActionForId(0, "1", "attack", "2");
    hook.result.current.setActionForId(0, "2", "nothing");
    hook.result.current.setActionForId(0, "3", "nothing");
    hook.result.current.setActionForId(0, "4", "protect", "3");
    hook.rerender();
    expect(hook.result.current.turn).toBe(0);
    hook.result.current.act(0);
    hook.rerender();
    expect(hook.result.current.gameRoles.get("2")?.isDead).toBeTruthy();
    expect(hook.result.current.turn).toBe(1);
  });
  it("should be protected", () => {
    const hook = setup();
    hook.result.current.setActionForId(0, "1", "attack", "2");
    hook.result.current.setActionForId(0, "2", "nothing");
    hook.result.current.setActionForId(0, "3", "nothing");
    hook.result.current.setActionForId(0, "4", "protect", "2");
    hook.rerender();
    hook.result.current.act(0);
    hook.rerender();
    expect(hook.result.current.gameRoles.get("2")?.isDead).toBeFalsy();
  });
});
