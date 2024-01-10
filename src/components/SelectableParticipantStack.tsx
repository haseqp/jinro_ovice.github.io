import { type Participant } from "../hooks/useOviceObject";
import { Button, Stack, Box, Avatar } from "@mui/material";

export const SelectableParticipantStack = ({
  participant,
  onClick,
  enabled = true,
}: {
  participant: Participant;
  onClick: () => void;
  enabled?: boolean;
}) => {
  return (
    <Stack direction="row">
      <Avatar src={participant.avatar_url} alt={participant.name} />
      <Box fontSize="h6.fontSize" m={1}>
        <Button disabled={!enabled} variant="text" onClick={onClick}>
          {participant.name}
        </Button>
      </Box>
    </Stack>
  );
};
