import { SelectableParticipantStack } from "../../components/SelectableParticipantStack";
import { type Participant } from "../../hooks/useOviceObject";
import { Stack } from "@mui/material";
import { useExecutables } from "../../hooks/useExecute";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGameRole } from "../../hooks/useGameRole";

export const Day = () => {
  const executables = useExecutables();
  const navigate = useNavigate();
  const { myRole } = useGameRole();

  useEffect(() => {
    if (myRole?.isDead ?? false) {
      navigate("/waiting", { state: { next: "/executed" } });
    }
  }, [navigate, myRole]);

  return (
    <div>
      <h1>Vote anyone to execute as a victim</h1>
      <Stack spacing={2}>
      {executables.map((participant: Participant) => (
        <SelectableParticipantStack key={participant.id}
          participant={participant}
          onClick={() => {
            const action = { action: "vote", targetId: participant.id };
            navigate("/waiting", { state: { action, next: "/executed" } });
          }}
        />
      ))}
      </Stack>
    </div>
  );
};
