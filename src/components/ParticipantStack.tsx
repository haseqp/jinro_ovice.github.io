import { Avatar, Stack, Box } from "@mui/material";
import type { Participant } from "../hooks/useOviceObject";

export const ParticipantStack = (
{
  participant,
}: {
  participant: Participant;
}
) => {

  return (
    <Stack direction="row">
      <Avatar src={participant.avatar_url} />
      <Box fontSize="h6.fontSize" m={1}>
        {participant.name}
      </Box>
    </Stack>
  );
};