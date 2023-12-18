import { type Participant } from "../hooks/useOviceObject";
import { Button, Grid } from "@mui/material";

export const SelectableParticipant = ({
  participant,
  onClick,
  enabled = true,
}: {
  participant: Participant;
  onClick: () => void;
  enabled?: boolean;
}) => {
  return (
    <Grid container direction="column" alignItems="center">
      <img src={participant.avatar_url} alt={participant.name} />
      <Button disabled={!enabled} variant="text" onClick={onClick}>
        {participant.name}
      </Button>
    </Grid>
  );
};
