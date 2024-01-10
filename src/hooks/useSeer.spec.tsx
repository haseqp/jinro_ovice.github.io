import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSeer } from "./useSeer";
import { participantsAtom } from "./useOviceObject";
import { useAtom } from "jotai";
import { useGameRole } from "./useGameRole";

describe("useSeer", () => {
  const setup = () => {
    const hook = renderHook(() => {
      const [participants, setParticipants] = useAtom(participantsAtom);
      const { setGameRoles } = useGameRole();
      const { seeRole, seeableParticipants } = useSeer();
      return {
        participants,
        setParticipants,
        setGameRoles,
        seeRole,
        seeableParticipants,
      };
    });
    hook.result.current.setParticipants([
      { name: "A", id: "1", avatar_url: "", isSelf: false },
      { name: "B", id: "2", avatar_url: "", isSelf: false },
      { name: "C", id: "3", avatar_url: "", isSelf: true },
      { name: "D", id: "4", avatar_url: "", isSelf: false },
    ]);
    hook.result.current.setGameRoles(
      new Map([
        ["1", { role: "wolf", id: "1", sortKey: "1" }],
        ["2", { role: "villager", id: "2", sortKey: "2" }],
        ["3", { role: "seer", id: "3", sortKey: "3" }],
        ["4", { role: "villager", id: "4", sortKey: "4", isDead: true }],
      ]),
    );
    hook.rerender();
    return hook;
  };

  it("should return the role of a participant", () => {
    const hook = setup();
    expect(hook.result.current.seeableParticipants).toMatchObject([
      { id: "1" },
      { id: "2" },
    ]);
    expect(hook.result.current.seeRole("2")).toBe("villager");

    hook.rerender();

    expect(hook.result.current.seeableParticipants).toMatchObject([
      { id: "1" },
    ]);
  });
});
