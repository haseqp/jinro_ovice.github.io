import { type Participant } from "../../hooks/useOviceObject";
import { SelectableParticipant } from "../SelectableParticipant";
import { useSeeRole, useSeeableParticipants } from "../../hooks/useSeer";
import { useState } from "react";
import { Button, Grid } from "@mui/material";

interface SeerNightSelected {
  participant: Participant;
  role: string;
}

export const SeerNight = ({ onClick }: { onClick: () => void }) => {
  const [selected, setSelected] = useState<SeerNightSelected | undefined>(
    undefined,
  );
  const seeRole = useSeeRole();
  const seeableParticipants = useSeeableParticipants();

  return (
    <div>
      {selected !== undefined ? (
        <>
          <h1>
            {selected.participant.name} is {selected.role}
          </h1>
          <Button
            variant="text"
            onClick={() => {
              onClick();
            }}
          >
            OK
          </Button>
        </>
      ) : (
        <>
          <h1>Select anyone to see their role</h1>
          {seeableParticipants.map((participant: Participant) => (
            <Grid key={participant.id} container direction="column" spacing={0}>
              <SelectableParticipant
                participant={participant}
                onClick={() => {
                  const role = seeRole(participant.id);
                  setSelected({ participant, role });
                }}
              />
            </Grid>
          ))}
        </>
      )}
    </div>
  );
};
