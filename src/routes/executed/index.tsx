
import { DeadParticipantStack } from '../../components/DeadParticipantStack';
import { Button, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useLastExecuted } from '../../hooks/useExecute';
import { useGameRole } from '../../hooks/useGameRole';
import { useMemo } from 'react';
import { useFindParticipantById } from '../../hooks/useOviceObject';
import type { Participant } from '../../hooks/useOviceObject';
import { useAction } from '../../hooks/useAction';
import { ParticipantStack } from '../../components/ParticipantStack';
import { useWinner } from '../../hooks/useWinner';

export const Executed = () => {
  const lastDeadParticipant = useLastExecuted();
  const navigate = useNavigate();
  const findParticipantById = useFindParticipantById();
  const { gameRoles } = useGameRole();
  const { turn } = useAction();
  const lastTurn = useMemo(() => turn - 1, [turn]);
  const lastParticipants = useMemo(() => 
      Array.from(gameRoles.values())
      .filter((gameRole) => gameRole.deadAt === undefined || gameRole.deadAt >= lastTurn)
      .map((gameRole) => findParticipantById(gameRole.id))
      .filter((participant) => participant !== undefined) as Participant[]
  ,[gameRoles, findParticipantById, lastTurn]);
  const winner = useWinner();

  return (
    <div>
      { lastDeadParticipant === undefined ? (
          <h1>No one is executed</h1>
        ) : (
          <div>
            <h1>{lastDeadParticipant.name} is executed</h1>
            <Stack spacing={2}>
              {lastParticipants.map((participant) => (
                participant.id === lastDeadParticipant.id ? (
                  <DeadParticipantStack key={participant.id} participant={participant} />
                ) : (
                  <ParticipantStack key={participant.id} participant={participant} />
                )
              ))}
            </Stack>
          </div>
      )}
      <br/>
      <Button variant="contained" color="primary" onClick={() => {
        if (winner === undefined) {
          navigate('/night');
        } else {
          navigate('/gameover');
        }
      }}>Next</Button>
    </div>
  );
};