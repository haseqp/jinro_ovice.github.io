import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGenerateGameRoles } from "./useGameRole";
import type { GameRole } from "./useGameRole";

describe("useGameRoles", () => {
  it("should return 1 wolve, 1 hunter, 1 seer if 4 ids", () => {
    const ids = ["1", "2", "3", "4"];
    const { result } = renderHook(() => useGenerateGameRoles(ids));
    const gameRoles = Array.from(result.current.values());
    expect(
      gameRoles.filter((role: GameRole) => role.role === "wolf").length,
    ).toBe(1);
    expect(
      gameRoles.filter((role: GameRole) => role.role === "hunter").length,
    ).toBe(1);
    expect(
      gameRoles.filter((role: GameRole) => role.role === "seer").length,
    ).toBe(1);
    expect(
      gameRoles.filter((role: GameRole) => role.role === "villager").length,
    ).toBe(1);

    expect(true).toBe(true);
  });
  it("should return 2 wolves, if 6 ids", () => {
    const ids = ["1", "2", "3", "4", "5", "6"];
    const { result } = renderHook(() => useGenerateGameRoles(ids));
    const gameRoles = Array.from(result.current.values());
    expect(
      gameRoles.filter((role: GameRole) => role.role === "wolf").length,
    ).toBe(2);
  });
});
