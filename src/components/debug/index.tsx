import { Button } from "@mui/material";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { participantsAtom, useMyself } from "../../hooks/useOviceObject";
import { useAtom, useAtomValue } from "jotai";
import { useCrypto } from "../../hooks/useCrypto";
import { useAction } from "../../hooks/useAction";

const AddParticipantButton = () => {
  const [, setParticipants] = useAtom(participantsAtom);

  return (
    <Button
      variant="text"
      onClick={() => {
        const name = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        });
        const id = Math.random().toString(32).substring(2);

        setParticipants((old) => {
          return [
            ...old,
            {
              id,
              name,
              avatar_url:
                "https://avatars.githubusercontent.com/u/100000?s=400",
              isSelf: false,
            },
          ];
        });
      }}
    >
      Add participant
    </Button>
  );
};

const SendPublicKeys = () => {
  const [participants] = useAtom(participantsAtom);
  const { publicKey } = useCrypto();
  const { myId } = useMyself();

  return (
    <Button
      variant="text"
      onClick={() => {
        participants.forEach((participant) => {
          if (participant.id === myId) {
            return;
          }
          const event = { type: "publicKey", id: participant.id, publicKey };
          window.postMessage({ type: "ovice_message", payload: event }, "*");
        });
      }}
    >
      Send public keys
    </Button>
  );
};

const SendNothing = () => {
  const participants = useAtomValue(participantsAtom);
  const { turn } = useAction();
  const { publicKey } = useCrypto();
  const { encrypt } = useCrypto();
  const { myId } = useMyself();
  return (
    <Button
      variant="text"
      onClick={() => {
        if (publicKey === undefined) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        participants.forEach(async (participant) => {
          if (participant.id === myId) {
            return;
          }
          const data = await encrypt(
            JSON.stringify({ action: "nothing" }),
            publicKey,
          );
          const event = {
            type: "action",
            id: participant.id,
            turn,
            action: data,
          };
          window.postMessage({ type: "ovice_message", payload: event }, "*");
        });
      }}
    >
      Send Nothing
    </Button>
  );
};

const VoteYou = () => {
  const participants = useAtomValue(participantsAtom);
  const { turn } = useAction();
  const { publicKey } = useCrypto();
  const { encrypt } = useCrypto();
  const { myId } = useMyself();
  return (
    <Button
      variant="text"
      onClick={() => {
        if (publicKey === undefined) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        participants.forEach(async (participant) => {
          if (participant.id === myId) {
            return;
          }
          const data = await encrypt(
            JSON.stringify({ action: "vote", targetId: myId }),
            publicKey,
          );
          const event = {
            type: "action",
            id: participant.id,
            turn,
            action: data,
          };
          window.postMessage({ type: "ovice_message", payload: event }, "*");
        });
      }}
    >
      Vote you
    </Button>
  );
};


export const Debug = () => {
  return (
    <>
      <AddParticipantButton />
      <SendPublicKeys />
      <SendNothing />
      <VoteYou />
    </>
  );
};
