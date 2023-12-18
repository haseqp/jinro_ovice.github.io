import { useMemo } from "react";
import { useParticipants } from "./useOviceObject";

export const useHost = () => {
  const participants = useParticipants();

  const hostId = useMemo(
    () => participants.map((participant) => participant.id).sort()[0],
    [participants],
  );
  const host = useMemo(
    () => participants.find((participant) => participant.id === hostId),
    [participants, hostId],
  );
  const isHost = useMemo(() => host?.isSelf, [host]);

  return { hostId, host, isHost };
};
