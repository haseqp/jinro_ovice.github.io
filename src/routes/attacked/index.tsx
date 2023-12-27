
import { useLastExecuted } from "../../hooks/useExecute";
import { DeadParticipantStack } from "../../components/DeadParticipantStack";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Attacked = () => {
  const lastDeadParticipant = useLastExecuted();
  const navigate = useNavigate();

  if (lastDeadParticipant === undefined) {
    return (<h1>No one is attacked</h1>);
  }
  return (
    <div> <DeadParticipantStack participant={lastDeadParticipant} />
      <br/>
      <Button variant="contained" color="primary" onClick={() => {
        navigate('/day');
      }}>Next</Button>
    </div>
  );
};