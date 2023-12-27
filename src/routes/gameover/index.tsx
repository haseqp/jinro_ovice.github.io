import { useWinner } from "../../hooks/useWinner";
import { useFindParticipantById } from "../../hooks/useOviceObject";
import { ParticipantWithRoleStack } from "../../components/ParticipantWithRoleStack";
import { useGameRole } from "../../hooks/useGameRole";
import { Stack } from "@mui/material";


export const Gameover = () => {
  const winner = useWinner();
  const { gameRoles } = useGameRole();
  const findParticipantById = useFindParticipantById();

  if (winner === undefined) {
    return null;
  }
  return (
    <div>
    <h1>{winner} team is won</h1>
      <Stack spacing={2}>
      {
        Array.from(gameRoles.values()).map((gameRole) => {
          const participant = findParticipantById(gameRole.id);
          if (participant === undefined) {
            return null;
          }
          return (
            <ParticipantWithRoleStack key={gameRole.id} participant={participant} gameRole={gameRole}/>
          );
        })
      }
      </Stack>
    </div>
  );
};