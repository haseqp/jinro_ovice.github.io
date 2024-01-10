import { type Participant } from "../hooks/useOviceObject";
import { Stack, Avatar, Box } from "@mui/material";

export const DeadParticipantStack = ({
  participant,
}: {
  participant: Participant;
}) => {
  return (
    <Stack direction="row">
      <Avatar
        style={{ filter: `grayscale(1)` }}
        src={participant.avatar_url}
        alt={participant.name}
      />
      <Box fontSize="h6.fontSize" m={1}>
        {participant.name}
      </Box>
    </Stack>
  );
};
