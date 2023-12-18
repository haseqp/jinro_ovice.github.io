import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNightCount } from "./useNightCount";
import { participantsAtom } from "./useOviceObject";
import { useAtom } from "jotai";

describe("useNightCount", () => {
  it("should return 1 origin", () => {
    const hook = renderHook(() => {
      const { nightCount } = useNightCount();
      return { nightCount };
    });
    expect(hook.result.current.nightCount).toBe(1);
  });
  it("should return 2 when everyone gets slept", () => {
    const hook1 = renderHook(() => {
      const [, setParticipants] = useAtom(participantsAtom);
      return { setParticipants };
    });
    hook1.result.current.setParticipants([
      { name: "A", id: "1", avatar_url: "", isSelf: true },
      { name: "B", id: "2", avatar_url: "", isSelf: false },
      { name: "C", id: "3", avatar_url: "", isSelf: false },
    ]);
    const hook2 = renderHook(() => {
      const { setCountForId } = useNightCount();
      return { setCountForId };
    });
    hook2.result.current.setCountForId("1", 1);
    hook2.result.current.setCountForId("2", 1);
    hook2.result.current.setCountForId("3", 1);
    const hook3 = renderHook(() => {
      const { nightCount } = useNightCount();
      return { nightCount };
    });
    expect(hook3.result.current.nightCount).toBe(2);
  });
});
