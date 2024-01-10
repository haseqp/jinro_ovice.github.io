import React, { useEffect } from "react";
import { participantsAtom } from "./hooks/useOviceObject";
import { useSetAtom } from "jotai";
import { useGameRole } from "./hooks/useGameRole";

const Decorator = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const setParticipants = useSetAtom(participantsAtom);
  const { setGameRoles } = useGameRole();

  useEffect(() => {
    setParticipants([
      {
        name: "A",
        id: "1",
        avatar_url: "https://avatars.githubusercontent.com/u/100000?s=400",
        isSelf: true,
      },
      {
        name: "B",
        id: "2",
        avatar_url: "https://avatars.githubusercontent.com/u/100000?s=400",
        isSelf: false,
      },
      {
        name: "C",
        id: "3",
        avatar_url: "https://avatars.githubusercontent.com/u/100000?s=400",
        isSelf: false,
      },
    ]);

    setGameRoles(
      new Map([
        ["1", { id: "1", role: "wolf", sortKey: "1" }],
        ["2", { id: "2", role: "villager", sortKey: "2" }],
        ["3", { id: "3", role: "seer", sortKey: "3" }],
      ]),
    );
  }, [setParticipants, setGameRoles]);

  return (
    <>
      <React.Suspense fallback="Loading...">{children}</React.Suspense>
    </>
  );
};

export default Decorator;
