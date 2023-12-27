import { describe, it, expect } from "vitest";
import { useAction } from "./useAction";
import { useGameRole } from "./useGameRole";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "jotai";
import type { ReactNode } from "react";

describe("useAction", () => {
  const setup = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );
    const hook = renderHook(
      () => {
        const { gameRoles, setGameRoles } = useGameRole();
        const { setActionForId, turn } = useAction();

        return { gameRoles, setGameRoles, setActionForId, turn };
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
    expect(hook.result.current.turn).toBe(0);
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
    expect(hook.result.current.gameRoles.get("2")?.isDead).toBeFalsy();
  });
  it("should be executed most voted", () => {
    const hook = setup();
    hook.result.current.setActionForId(0, "1", "vote", "3");
    hook.result.current.setActionForId(0, "2", "vote", "3");
    hook.result.current.setActionForId(0, "3", "vote", "2");
    hook.result.current.setActionForId(0, "4", "vote", "1");
    hook.rerender();
    expect(hook.result.current.gameRoles.get("3")?.isDead).toBeTruthy();
  });
  it("should be executed most voted and less sortkey", () => {
    const hook = setup();
    hook.result.current.setActionForId(0, "1", "vote", "4");
    hook.result.current.setActionForId(0, "2", "vote", "4");
    hook.result.current.setActionForId(0, "3", "vote", "2");
    hook.result.current.setActionForId(0, "4", "vote", "2");
    hook.rerender();
    expect(hook.result.current.gameRoles.get("2")?.isDead).toBeTruthy();
  });
  it("should not be necessary for dead participant", () => {
    const hook = setup();
    expect(hook.result.current.turn).toBe(0);
    hook.result.current.setGameRoles((prev) => {
      const next = new Map(prev);
      const found = next.get("2");
      if (found !== undefined) {
        found.isDead = true;
      }
      return next;
    });
    hook.result.current.setActionForId(0, "1", "vote", "3");
    hook.result.current.setActionForId(0, "3", "vote", "1");
    hook.result.current.setActionForId(0, "4", "vote", "1");
    hook.rerender();
    expect(hook.result.current.gameRoles.get("1")?.isDead).toBeTruthy();
    expect(hook.result.current.turn).toBe(1);
  });
  it("should ignore action from dead participant", () => {
    const hook = setup();
    expect(hook.result.current.turn).toBe(0);
    hook.result.current.setGameRoles((prev) => {
      const next = new Map(prev);
      const found = next.get("2");
      if (found !== undefined) {
        found.isDead = true;
      }
      return next;
    });
    hook.result.current.setActionForId(0, "1", "vote", "3");
    hook.result.current.setActionForId(0, "2", "vote", "1");
    hook.result.current.setActionForId(0, "3", "vote", "3");
    hook.result.current.setActionForId(0, "4", "vote", "1");
    hook.rerender();
    expect(hook.result.current.gameRoles.get("3")?.isDead).toBeTruthy();
    expect(hook.result.current.turn).toBe(1);
  });
});
