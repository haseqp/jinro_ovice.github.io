import { useParticipants } from "../../hooks/useOviceObject";
import { Button, Avatar, Stack, Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicKeyStore } from "../../hooks/useCrypto";

export const Start = () => {
  const participants = useParticipants();
  const navigate = useNavigate();
  const { publicKeyStore } = usePublicKeyStore();

  useEffect(() => {
    if (publicKeyStore?.size === 0) {
      return;
    }
    navigate("/handshake");
  }, [publicKeyStore, navigate]);

  return (
    <>
      <Stack spacing={2}>
        {participants.map((participant) => (
          <Stack key={participant.id} direction="row">
            <Avatar src={participant.avatar_url} />
            <Box fontSize="h6.fontSize" m={1}>
              {participant.name}
            </Box>
          </Stack>
        ))}
      </Stack>
      <Button
        variant="text"
        onClick={() => {
          navigate("/handshake");
        }}
      >
        Start
      </Button>
    </>
  );
};
