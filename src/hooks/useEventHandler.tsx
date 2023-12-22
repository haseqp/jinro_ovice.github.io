import { useCallback } from "react";
import { useOnMessage } from "./useOviceObject";
import { usePublicKeyStore, useCrypto } from "./useCrypto";
import { useGameRole } from "./useGameRole";
import type { GameRole } from "./useGameRole";
import { useHost } from "./useHost";
import { useAction } from "./useAction";
import type { Action } from "./useAction";

export interface BaseEvent {
  type: string;
}

export type NightActionEvent = {
  type: "nightAction";
  turn: number;
  id: string;
  action: ArrayBuffer[];
} & BaseEvent;

export type PublicKeyEvent = {
  publicKey: CryptoKey;
  id: string;
} & BaseEvent;

export type RolesEvent = {
  roles: ArrayBuffer[];
} & BaseEvent;

const useNightActionEvent = () => {
  const { privateKey, decrypt } = useCrypto();
  const { isHost } = useHost();
  const { setActionForId } = useAction();
  const onMessage = useCallback(
    async (message: NightActionEvent) => {
      if (message.type !== "nightAction") {
        return;
      }
      if (
        isHost === undefined ||
        privateKey === undefined ||
        decrypt === undefined
      ) {
        return;
      }
      const action = JSON.parse(
        await decrypt(message.action, privateKey),
      ) as Action;
      setActionForId(message.turn, message.id, action.action, action.targetId);
    },
    [privateKey, decrypt, isHost, setActionForId],
  );

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useOnMessage(onMessage);
};

const usePublicKeyEvent = () => {
  const { addPublicKey } = usePublicKeyStore();
  const onMessage = useCallback(
    (message: PublicKeyEvent) => {
      if (
        message.type !== "publicKey" ||
        message.publicKey === undefined ||
        message.id === undefined
      ) {
        return;
      }
      addPublicKey(message.id, message.publicKey);
    },
    [addPublicKey],
  );

  useOnMessage(onMessage);
};

const useRolesEvent = () => {
  const { privateKey, decrypt } = useCrypto();
  const { setGameRoles } = useGameRole();

  const onMessage = useCallback(
    async (message: RolesEvent) => {
      try {
        if (privateKey === undefined || decrypt === undefined) {
          return;
        }
        if (message.type === "roles") {
          const roles = new Map<string, GameRole>(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Object.entries(JSON.parse(await decrypt(message.roles, privateKey))),
          );
          setGameRoles(roles);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [privateKey, decrypt, setGameRoles],
  );

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useOnMessage(onMessage);
};

export const useEventHandler = () => {
  usePublicKeyEvent();
  useRolesEvent();
  useNightActionEvent();
};
