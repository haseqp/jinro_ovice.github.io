import { useEffect, useMemo, useRef } from "react";
import { useCrypto, usePublicKeyStore } from "../../hooks/useCrypto";
import {
  useEmitOrLoopbackMessage,
  useParticipants,
  useMyself,
  useBroadcastMessage,
} from "../../hooks/useOviceObject";
import { useGameRole, useGenerateGameRoles } from "../../hooks/useGameRole";
import { useNavigate } from "react-router-dom";
import {
  type PublicKeyEvent,
  type RolesEvent,
} from "../../hooks/useEventHandler";
import { useHost } from "../../hooks/useHost";
import { useAtom, atom } from "jotai";

const sentBroadcastAtom = atom(false);

const useHandshake = () => {
  const broadcast = useBroadcastMessage();
  const { publicKey } = useCrypto();
  const { addPublicKey } = usePublicKeyStore();
  const { myId } = useMyself();
  const [ sentBroadcast, setSentBroadcast] = useAtom(sentBroadcastAtom);
  const sentBroadcastRef = useRef(sentBroadcast);

  useEffect(() => {
    if (publicKey === undefined || myId === undefined) {
      return;
    }
    if (sentBroadcastRef.current) {
      return;
    }
    sentBroadcastRef.current = true;
    setSentBroadcast(true);
    addPublicKey(myId, publicKey);
    const event: PublicKeyEvent = {
      type: "publicKey",
      id: myId,
      publicKey,
    };
    broadcast(event);
  }, [publicKey, myId, broadcast, addPublicKey, setSentBroadcast]);
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
  });
};

const HandshakeForGuest = () => {
  useHandshake();
  useNavigateToShowRole();

  return null;
};

const HandshakeForHost = () => {
  const { publicKeyStore } = usePublicKeyStore();
  const participants = useParticipants();
  const emit = useEmitOrLoopbackMessage();
  const { encrypt } = useCrypto();
  const ids = useMemo(
    () => Array.from(publicKeyStore.keys()),
    [publicKeyStore],
  );
  const roles = useGenerateGameRoles(ids);

  useHandshake();
  useNavigateToShowRole();

  useEffect(() => {
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
  }, [publicKeyStore, participants, roles, encrypt, emit]);

  return null;
};

export const Handshake = () => {
  const { isHost } = useHost();

  if (isHost === undefined) {
    return null;
  }

  return isHost ? (<HandshakeForHost/>) : (<HandshakeForGuest/>);
};
