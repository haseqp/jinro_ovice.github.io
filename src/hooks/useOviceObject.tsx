import { atom, useAtom } from "jotai";
import { useCallback, useMemo, useEffect } from "react";

export interface Participant {
  name: string;
  id: string;
  avatar_url: string;
  isSelf: boolean;
}

export const participantsAtom = atom<Participant[]>([]);

participantsAtom.onMount = (update: (value: Participant[]) => void) => {
  update([
    {
      name: "Alexel Konoe",
      id: "1",
      avatar_url: "https://avatars.githubusercontent.com/u/100000?s=400",
      isSelf: true,
    },
    {
      name: "Mula Flaga",
      id: "2",
      avatar_url: "https://avatars.githubusercontent.com/u/100000?s=400",
      isSelf: false,
    },
  ]);
};

export const useParticipants = () => {
  const [participants] = useAtom(participantsAtom);

  return participants;
};

export const useMyself = () => {
  const [participants] = useAtom(participantsAtom);

  const myself = useMemo(
    () => participants.find((participant) => participant.isSelf),
    [participants],
  );
  const myId = useMemo(() => myself?.id, [myself?.id]);

  return { myself, myId };
};

export const useBroadcastMessage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const broadcast = useCallback((message: any) => {
    window.postMessage(
      { type: "ovice_broadcast_message", payload: message },
      "*",
    );
  }, []);

  return broadcast;
};

export const useEmitMessage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = useCallback((receiverId: string, message: any) => {
    window.postMessage(
      { type: "ovice_emit_message", payload: { receiverId, ...message } },
      "*",
    );
  }, []);

  return emit;
};

export const useLoopbackMessage = () => {
  const { myId } = useMyself();
  const loopback = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message: any) => {
      window.postMessage(
        { type: "ovice_message", payload: { receiverId: myId, ...message } },
        "*",
      );
    },
    [myId],
  );

  return loopback;
};

export const useEmitOrLoopbackMessage = () => {
  const { myId } = useMyself();
  const loopback = useLoopbackMessage();
  const emit = useEmitMessage();
  const callback = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (receiverId: string, message: any) => {
      if (receiverId === myId) {
        loopback(message);
      } else {
        emit(receiverId, message);
      }
      window.postMessage(
        { type: "ovice_emit_message", payload: { receiverId, ...message } },
        "*",
      );
    },
    [myId, loopback, emit],
  );

  return callback;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOnMessage = (callback: (message: any) => void) => {
  const eventListener = useCallback(
    (event: MessageEvent) => {
      if (event.data.type !== "ovice_message") {
        return;
      }
      try {
        callback(event.data.payload);
      } catch (e) {
        console.error(e);
      }
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener("message", eventListener);
    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [eventListener]);
};
