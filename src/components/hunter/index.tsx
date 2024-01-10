import { type Participant } from "../../hooks/useOviceObject";
import { SelectableParticipantStack } from "../SelectableParticipantStack";
import { useHunter } from "../../hooks/useHunter";
import { Stack } from "@mui/material";

export interface HunterAction {
  type: "protect";
  targetId: string;
}

export const HunterNight = ({
  onClick,
}: {
  onClick?: (action: HunterAction) => void;
}) => {
  const { protect, protectableParticipants } = useHunter();
  return (
    <div>
      <h1>Select someone to protect</h1>
      <Stack spacing={2}>
        {protectableParticipants.map((participant: Participant) => (
          <SelectableParticipantStack
            key={participant.id}
            participant={participant}
            onClick={() => {
              protect(participant.id);
              onClick?.({
                type: "protect",
                targetId: participant.id,
              });
            }}
          />
        ))}
      </Stack>
    </div>
  );
};
