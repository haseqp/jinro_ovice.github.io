import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGameRole } from "./useGameRole";
import { useWinner } from "./useWinner";
import { Provider } from "jotai";
import type { ReactNode } from "react";

describe("useWinner", () => {
  const setup = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );
    const hook = renderHook(
      () => {
        const { setGameRoles } = useGameRole();
        const winner = useWinner();

        return { setGameRoles, winner };
      },
      { wrapper },
    );

    return hook;
  };

  it("should return wolf if half players are wolf", () => {
    const hook = setup();
    hook.result.current.setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1" }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3", isDead: true }],
      ]),
    );
    hook.rerender();

    expect(hook.result.current.winner).toBe("wolf");
  });
  it("should return villager if all players are villager", () => {
    const hook = setup();
    hook.result.current.setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1", isDead: true }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3" }],
      ]),
    );
    hook.rerender();

    expect(hook.result.current.winner).toBe("villager");
  });
  it("should return undefiend if all game is not yet over", () => {
    const hook = setup();
    hook.result.current.setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1" }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3" }],
      ]),
    );
    hook.rerender();

    expect(hook.result.current.winner).toBe(undefined);
  });
});
