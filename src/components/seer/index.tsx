import { type Participant } from "../../hooks/useOviceObject";
import { SelectableParticipantStack } from "../SelectableParticipantStack";
import { useSeer } from "../../hooks/useSeer";
import { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { ParticipantWithRoleStack } from "../ParticipantWithRoleStack";

interface SeerNightSelected {
  participant: Participant;
  role: string;
}

export const SeerNight = ({ onClick }: { onClick: () => void }) => {
  const [selected, setSelected] = useState<SeerNightSelected | undefined>(
    undefined,
  );
  const { seeRole, seeableParticipants } = useSeer();
  const [participants, setParticipants] = useState<Participant[]>([]);
  useEffect(() => {
    setParticipants((prev) => {
      if (prev.length === 0) {
        return seeableParticipants;
      }
      return prev;
    });
  }, [seeableParticipants]);

  return (
    <div>
      {selected === undefined ? (
          <h1>Select anyone to see their role</h1>
      ) : (
        <h1>
          {selected.participant.name} is {selected.role}
        </h1>
      )}
        <Stack spacing={2}>
        {participants.map((participant: Participant) => 
          selected?.participant.id === participant.id ? (
            <ParticipantWithRoleStack
              key={participant.id}
              participant={participant}
              gameRole={{role: selected.role }}/>
          ) : (
            <SelectableParticipantStack
            key={participant.id}
              participant={participant}
              enabled={selected === undefined}
              onClick={() => {
                const role = seeRole(participant.id);
                setSelected({ participant, role });
              }}
            />
        ))}
        </Stack>
        {selected !== undefined && (
          <Button
            variant="text"
            onClick={() => {
              onClick();
            }}
          >
            Next
          </Button>
        )}
    </div>
  );
};
