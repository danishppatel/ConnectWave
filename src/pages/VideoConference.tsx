import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import useToast from "../hooks/useToast";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { FieldErrorType, UserType } from "../utils/types";
import moment from "moment";
import { generateMeetingID } from "../utils/generateMeetingId";
import Navbar from "../components/Navbar";
import {
  EuiFlexGroup,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
} from "@elastic/eui";
import MeetingNameField from "../components/FormComponents/MeetingNameField";
import MeetingUserField from "../components/FormComponents/MeetingUserField";
import MeetingFieldDate from "../components/FormComponents/MeetingFieldDate";
import CreateMeetingButtons from "../components/FormComponents/CreateMeetingButtons";
import { addDoc } from "firebase/firestore";
import { meetingsRef } from "../utils/FirebaseConfig";
import MeetingMaximumUsersField from "../components/FormComponents/MeetingMaximumUsersField";

export default function VideoConference() {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();
  const uid = useAppSelector((connectWave) => connectWave.auth.userInfo?.uid);
  const navigate = useNavigate();

  const [meetingName, setMeetingName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [size, setSize] = useState(1);
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);
  const [showErrors, setShowErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });

  const onUserChange = (selectedOptions: Array<UserType>) => {
    setSelectedUsers(selectedOptions);
  };

  const validateForm = () => {
    const showErrors_ = { ...showErrors };
    let errors = false;

    //if not provide a meeting name
    if (!meetingName.length) {
      showErrors_.meetingName.show = true;
      showErrors_.meetingName.message = ["Please Enter Meeting Name"];
      errors = true;
    } else {
      showErrors_.meetingName.show = false;
      showErrors_.meetingName.message = [];
    }

    //if not provide a any user
    if (!anyoneCanJoin && !selectedUsers.length) {
      showErrors_.meetingUser.show = true;
      showErrors_.meetingUser.message = ["Please Select a User"];
      errors = true;
    } else {
      showErrors_.meetingUser.show = false;
      showErrors_.meetingUser.message = [];
    }
    setShowErrors(showErrors_);

    return errors;
  };

  const createMeeting = async () => {
    if (!validateForm()) {
      const meetingId = generateMeetingID();

      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: anyoneCanJoin ? "anyone-can-join" : "video-conference",
        invitedUsers: anyoneCanJoin
          ? []
          : selectedUsers.map((user: UserType) => user.uid),
        meetingDate: startDate.format("L"),
        maxUsers: anyoneCanJoin ? 100 : size,
        status: true,
      });

      createToast({
        title: anyoneCanJoin
          ? "Anyone can join meeting created successfully"
          : "Video Conference created successfully",
        type: "success",
      });

      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiForm>
          <EuiFormRow display="columnCompressedSwitch" label="Anyone can Join">
            <EuiSwitch
              showLabel={false}
              label="Anyone can Join"
              checked={anyoneCanJoin}
              onChange={(e) => setAnyoneCanJoin(e.target.checked)}
              compressed
            />
          </EuiFormRow>
          <MeetingNameField
            label="Meeting name"
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            placeholder="Meeting name"
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          {anyoneCanJoin ? (
            <MeetingMaximumUsersField value={size} setSize={setSize} />
          ) : (
            <MeetingUserField
              label="Invite User"
              isInvalid={showErrors.meetingUser.show}
              error={showErrors.meetingUser.message}
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUsers}
              singleSelection={false}
              isClearable={false}
              placeholder="Select a User"
            />
          )}
          <MeetingFieldDate selected={startDate} setStartDate={setStartDate} />
          <EuiSpacer />
          <CreateMeetingButtons createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}
