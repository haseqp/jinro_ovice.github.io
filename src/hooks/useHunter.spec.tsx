import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHunter } from "./useHunter";
import { participantsAtom } from "./useOviceObject";
import { useGameRole } from "./useGameRole";
import { useSetAtom } from "jotai";

describe("useHunter", () => {
  const setup = () => {
    const hook = renderHook(() => {
      const setParticipants = useSetAtom(participantsAtom);
      const { setGameRoles } = useGameRole();
      const { protectableParticipants, protect } = useHunter();

      return {
        setParticipants,
        setGameRoles,
        protectableParticipants,
        protect,
      };
    });
    hook.result.current.setParticipants([
      { name: "A", id: "1", avatar_url: "", isSelf: true },
      { name: "B", id: "2", avatar_url: "", isSelf: false },
      { name: "C", id: "3", avatar_url: "", isSelf: false },
    ]);
    hook.result.current.setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1" }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3", isDead: true }],
      ]),
    );
    hook.rerender();

    return hook;
  };
  it("should return attackable participants", () => {
    const hook = setup();
    expect(hook.result.current.protectableParticipants).toMatchObject([
      { id: "2" },
    ]);
    hook.result.current.protect("2");
    hook.rerender();
    expect(hook.result.current.protectableParticipants.length).toBe(0);
  });
});
