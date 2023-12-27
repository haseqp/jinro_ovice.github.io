
import { Avatar, Stack, Box } from "@mui/material";
import type { Participant } from "../hooks/useOviceObject";

export const ParticipantWithRoleStack = (
{
  participant,
  gameRole,
}: {
  participant: Participant;
  gameRole: {isDead?: boolean, role: string};
}
) => {

  return (
    <Stack direction="row">
      <Avatar style={{filter: (gameRole.isDead ?? false) ? 'grayscale(1)' : 'grayscale(0)'}} src={participant.avatar_url} />
      <Box fontSize="h6.fontSize" m={1}>
        {participant.name} ({gameRole.role})
      </Box>
    </Stack>
  );
};