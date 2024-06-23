import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from "@elastic/eui";
import meeting1 from '../assets/meeting1.png';
import meeting2 from '../assets/meeting2.png';


function CreateMeeting() {
  useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Navbar/> 
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          style={{ margin: "5vh 10vw" }}
        >
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={meeting1} alt="icon" size="100%" />}

              title={`Create 1 on 1 Meeting`}
              description="Create a personal single person meeting."
              onClick={() => navigate("/create1on1")}
              paddingSize="xl"
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={meeting2} alt="icon" size="100%" />}
              title={`Create Video Conference`}
              description="Invite multiple persons to the meeting."
              onClick={() => navigate("/videoconference")}
              paddingSize="xl"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  );
}

export default CreateMeeting;
