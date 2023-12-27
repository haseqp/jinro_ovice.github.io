import { useParticipants } from "../../hooks/useOviceObject";
import { Button, Stack } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicKeyStore } from "../../hooks/useCrypto";
import { ParticipantStack } from "../../components/ParticipantStack";
import { atom, useSetAtom } from "jotai";

export const startedAtom = atom(false);

export const Start = () => {
  const participants = useParticipants();
  const navigate = useNavigate();
  const { publicKeyStore } = usePublicKeyStore();
  const setStarted = useSetAtom(startedAtom);

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
          <ParticipantStack key={participant.id} participant={participant} />
        ))}
      </Stack>
      <Button
        variant="text"
        disabled={participants?.length < 3}
        onClick={() => {
          setStarted(true);
          navigate("/handshake");
        }}
      >
        Start
      </Button>
    </>
  );
};
