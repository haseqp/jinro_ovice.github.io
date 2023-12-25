import { Button } from "@mui/material";
import { SeerNight } from "../../components/seer";
import { useGameRole } from "../../hooks/useGameRole";
import type { GameRole } from "../../hooks/useGameRole";
import { useCallback, useEffect, useState } from "react";
import {
  useParticipants,
  type Participant,
  useMyself,
} from "../../hooks/useOviceObject";
import { useNavigate } from "react-router-dom";

export const WolfNight = ({ onClick }: { onClick: () => void }) => {
  const { gameRoles } = useGameRole();
  const [otherWolves, setOtherWolves] = useState<Participant[]>([]);
  const { myId } = useMyself();
  const particpants = useParticipants();

  useEffect(() => {
    const wolves = new Array<Participant>();
    gameRoles?.forEach((value: GameRole, key: string) => {
      if (key !== myId && value.role === "wolf") {
        const found = particpants.filter(
          (participant: Participant) => participant.id === key,
        )?.[0];
        if (found !== undefined) {
          wolves.push(found);
        }
      }
    });
    setOtherWolves(wolves);
  }, [gameRoles, myId, setOtherWolves, particpants]);

  return (
    <div>
      {otherWolves.length === 0 ? (
        <h1>There is no other wolves.</h1>
      ) : (
        <>
          <h1>Other Wolves</h1>
          <ul>
            {otherWolves.map((wolf: Participant) => (
              <li key={wolf.id}>{wolf.name}</li>
            ))}
          </ul>
        </>
      )}
      <Button
        variant="text"
        onClick={() => {
          onClick();
        }}
      >
        OK
      </Button>
    </div>
  );
};

export const FirstNight = () => {
  const { myRole } = useGameRole();
  const navigate = useNavigate();

  const toNavigate = useCallback(() => {
    navigate("/waiting", { state: { next: "/day" } });
  }, [navigate]);

  useEffect(() => {
    if (myRole === undefined) {
      return;
    }
    if (myRole.role === "wolf" || myRole.role === "seer") {
      return;
    }
    toNavigate();

  }, [toNavigate, myRole]);

  if (myRole === undefined) {
    return null;
  } else if (myRole.role === "wolf") {
    return <WolfNight onClick={toNavigate} />;
  } else if (myRole.role === "seer") {
    return <SeerNight onClick={toNavigate} />;
  } else {
    return null;
  }
};
