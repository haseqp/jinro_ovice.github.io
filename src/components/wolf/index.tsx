import { type Participant } from "../../hooks/useOviceObject";
import { SelectableParticipant } from "../SelectableParticipant";
import { useWolf } from "../../hooks/useWolf";
import { Grid } from "@mui/material";

export interface WolfAction {
  type: "attack";
  targetId: string;
}

export const WolfNight = ({
  onClick,
}: {
  onClick: (action: WolfAction) => void;
}) => {
  const { attackableParticipants } = useWolf();
  return (
    <div>
      <h1>Select someone to see their role</h1>
      {attackableParticipants.map((participant: Participant) => (
        <Grid key={participant.id} container direction="column" spacing={0}>
          <SelectableParticipant
            participant={participant}
            onClick={() => {
              onClick({
                type: "attack",
                targetId: participant.id,
              });
            }}
          />
        </Grid>
      ))}
    </div>
  );
};
