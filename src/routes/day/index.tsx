import { SelectableParticipant } from "../../components/SelectableParticipant";
import { type Participant } from "../../hooks/useOviceObject";
import { Grid } from "@mui/material";
import { useExecutables } from "../../hooks/useExecute";
import { useNavigate } from "react-router-dom";

export const Day = () => {
  const executables = useExecutables();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Vote anyone to execute as a victim</h1>
      {executables.map((participant: Participant) => (
        <Grid key={participant.id} container direction="column" spacing={0}>
          <SelectableParticipant
            participant={participant}
            onClick={() => {
              const action = { action: "vote", targetId: participant.id };
              navigate("/waiting", { state: { action, next: "/night" } });
            }}
          />
        </Grid>
      ))}
    </div>
  );
};
