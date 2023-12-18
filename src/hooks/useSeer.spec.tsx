import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSeeRole, useSeeableParticipants } from "./useSeer";
import { participantsAtom, useParticipants } from "./useOviceObject";
import { useAtom } from "jotai";
import { useGameRole } from "./useGameRole";

describe("useSeer", () => {
  it("should return the role of a participant", () => {
    const hook1 = renderHook(() => {
      const [, setParticipants] = useAtom(participantsAtom);
      const { setGameRoles } = useGameRole();
      return { setParticipants, setGameRoles };
    });
    hook1.result.current.setParticipants([
      { name: "A", id: "1", avatar_url: "", isSelf: true },
      { name: "B", id: "2", avatar_url: "", isSelf: false },
      { name: "C", id: "3", avatar_url: "", isSelf: false },
    ]);
    hook1.result.current.setGameRoles(
      new Map([
        ["1", { role: "wolf", id: "1", sortKey: "1" }],
        ["2", { role: "villager", id: "2", sortKey: "2" }],
        ["3", { role: "seer", id: "3", sortKey: "3" }],
      ]),
    );

    const hook2 = renderHook(() => {
      const seeRole = useSeeRole();
      const participants = useParticipants();
      const seeableParticipants = useSeeableParticipants();

      return { seeRole, seeableParticipants, participants };
    });
    expect(hook2.result.current.seeableParticipants.length).toBe(2);
    expect(hook2.result.current.seeableParticipants[0].id).toBe("2");
    expect(hook2.result.current.seeableParticipants[1].id).toBe("3");
    expect(hook2.result.current.seeRole("2")).toBe("villager");
    const hook3 = renderHook(() => {
      const seeRole = useSeeRole();
      const seeableParticipants = useSeeableParticipants();

      return { seeRole, seeableParticipants };
    });
    expect(hook3.result.current.seeableParticipants.length).toBe(1);
    expect(hook3.result.current.seeableParticipants[0].id).toBe("3");
  });
});
