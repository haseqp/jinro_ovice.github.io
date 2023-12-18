import { useEffect, useMemo } from "react";
import { useCrypto, usePublicKeyStore } from "../../hooks/useCrypto";
import {
  useEmitOrLoopbackMessage,
  useParticipants,
  useMyself,
  useBroadcastMessage,
} from "../../hooks/useOviceObject";
import { useGameRole, useGenerateGameRoles } from "../../hooks/useGameRole";
import { useNavigate } from "react-router-dom";
import { useHost } from "../../hooks/useHost";
import {
  type PublicKeyEvent,
  type RolesEvent,
} from "../../hooks/useEventHandler";

const useHandshake = (myId?: string) => {
  const broadcast = useBroadcastMessage();
  const { publicKey } = useCrypto();

  useEffect(() => {
    if (publicKey === undefined || myId === undefined) {
      return;
    }
    const event: PublicKeyEvent = {
      type: "publicKey",
      id: myId,
      publicKey,
    };
    broadcast(event);
  }, [publicKey, myId, broadcast]);
};

const useNavigateToShowRole = () => {
  const { myRole } = useGameRole();
  const participants = useParticipants();
  const { publicKeyStore } = usePublicKeyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (myRole === undefined) {
      return;
    }
    if (publicKeyStore?.size !== participants.length) {
      return;
    }
    navigate("/showRole");
  }, [myRole, navigate, publicKeyStore, participants]);
};

const HandshakeForGuest = (myId?: string) => {
  useHandshake(myId);
  useNavigateToShowRole();

  return null;
};

const HandshakeForHost = (myId?: string) => {
  const { publicKeyStore } = usePublicKeyStore();
  const participants = useParticipants();
  const emit = useEmitOrLoopbackMessage();
  const { encrypt } = useCrypto();
  const ids = useMemo(
    () => Array.from(publicKeyStore.keys()),
    [publicKeyStore],
  );
  const roles = useGenerateGameRoles(ids);
  const { setGameRoles } = useGameRole();

  useHandshake(myId);
  useNavigateToShowRole();

  useEffect(() => {
    if (myId === undefined) {
      return;
    }
    if (publicKeyStore?.size !== participants.length) {
      return;
    }
    if (roles.size !== participants.length) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        for (const [id, publicKey] of publicKeyStore) {
          const encryptedRoles = await encrypt(
            JSON.stringify(Object.fromEntries(roles)),
            publicKey,
          );
          const event: RolesEvent = {
            type: "roles",
            roles: encryptedRoles,
          };
          emit(id, event);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      console.log("dettached");
    };
  }, [publicKeyStore, participants, roles, encrypt, emit, myId, setGameRoles]);

  return null;
};

export const Handshake = () => {
  const { isHost } = useHost();
  const { myId } = useMyself();

  if (isHost === undefined || myId === undefined) {
    return null;
  }

  return isHost ? HandshakeForHost(myId) : HandshakeForGuest(myId);
};
