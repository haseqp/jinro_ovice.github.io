import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWolf } from "./useWolf";
import { participantsAtom } from "./useOviceObject";
import { useGameRole } from "./useGameRole";
import { useSetAtom } from "jotai";

describe("useWolf", () => {
  const setup = () => {
    const hook = renderHook(() => {
      const setParticipants = useSetAtom(participantsAtom);
      const { setGameRoles } = useGameRole();

      return { setParticipants, setGameRoles };
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
        ["3", { id: "3", role: "seer", sortKey: "3" }],
      ]),
    );
  };
  it("should return attackable participants", () => {
    setup();
    const hook1 = renderHook(() => {
      const { attack, attackableParticipants } = useWolf();

      return { attack, attackableParticipants };
    });
    expect(hook1.result.current.attackableParticipants.length).toBe(2);
    hook1.result.current.attack("2");
    const hook2 = renderHook(() => {
      const { attackableParticipants } = useWolf();

      return { attackableParticipants };
    });
    expect(hook2.result.current.attackableParticipants.length).toBe(1);
  });
});
