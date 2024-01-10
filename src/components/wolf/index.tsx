import { type Participant } from "../../hooks/useOviceObject";
import { SelectableParticipantStack } from "../SelectableParticipantStack";
import { useWolf } from "../../hooks/useWolf";
import { Stack } from "@mui/material";

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
      <h1>Select someone to attack</h1>
      <Stack spacing={2}>
        {attackableParticipants.map((participant: Participant) => (
          <SelectableParticipantStack
            key={participant.id}
            participant={participant}
            onClick={() => {
              onClick({
                type: "attack",
                targetId: participant.id,
              });
            }}
          />
        ))}
      </Stack>
    </div>
  );
};
