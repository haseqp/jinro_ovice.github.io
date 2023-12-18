import {
  useMyself,
  type Participant,
  useParticipants,
  useEmitOrLoopbackMessage,
} from "../../hooks/useOviceObject";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCrypto, usePublicKeyStore } from "../../hooks/useCrypto";
import { useAction } from "../../hooks/useAction";

export const Sleeping = () => {
  const emit = useEmitOrLoopbackMessage();
  const { turn } = useAction();
  const { myId } = useMyself();
  const navigate = useNavigate();
  const countRef = useRef<number>(turn);
  const action = useLocation().state?.action;
  const { encrypt } = useCrypto();
  const participants = useParticipants();
  const { publicKeyStore } = usePublicKeyStore();

  useEffect(() => {
    if (myId === undefined) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    participants.forEach(async (participant: Participant) => {
      const publicKey = publicKeyStore.get(participant.id);
      if (publicKey !== undefined) {
        const encrypted = await encrypt(
          JSON.stringify(action ?? { action: "nothing" }),
          publicKey,
        );
        emit(participant.id, {
          type: "nightAction",
          id: myId,
          turn: countRef.current,
          action: encrypted,
        });
      }
    });
  }, [myId, participants, publicKeyStore, action, emit, encrypt]);

  useEffect(() => {
    if (countRef.current !== turn) {
      navigate("/day");
    }
  }, [turn, navigate]);
  return <h1>Waiting for the morning</h1>;
};
