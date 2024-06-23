import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import useFetchUsers from '../hooks/useFetchUsers';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { FieldErrorType, UserType } from '../utils/types';
import moment from 'moment';
import Navbar from '../components/Navbar';
import { EuiFlexGroup, EuiForm, EuiSpacer } from '@elastic/eui';
import MeetingNameField from '../components/FormComponents/MeetingNameField';
import MeetingUserField from '../components/FormComponents/MeetingUserField';
import CreateMeetingButtons from '../components/FormComponents/CreateMeetingButtons';
import MeetingFieldDate from '../components/FormComponents/MeetingFieldDate';
import { generateMeetingID } from '../utils/generateMeetingId';
import { addDoc } from 'firebase/firestore';
import { meetingsRef } from '../utils/FirebaseConfig';
import useToast from '../hooks/useToast';

export default function OneOnOneMeeting() {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();
  const uid = useAppSelector((connectWave) => connectWave.auth.userInfo?.uid);
  const navigate = useNavigate();

  const [meetingName, setMeetingName] = useState("");
  const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
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
    setSelectedUser(selectedOptions);
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
    if (!selectedUser.length) {
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
    if(!validateForm()) {
      const meetingId = generateMeetingID();
     
      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: "1-on-1",
        invitedUsers: [selectedUser[0].uid],
        meetingDate: startDate.format("L"),
        maxUsers: 1,
        status: true,
      });

      createToast({
        title:"One on One Meeting Created Successfully.",
        type:"success"
      })

      navigate('/');
          
    }
  }

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
          <MeetingNameField
            label="Meeting name"
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            placeholder="Meeting name"
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          <MeetingUserField
            label="Invite User"
            isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
            options={users}
            onChange={onUserChange}
            selectedOptions={selectedUser}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            placeholder="Select a User"
          />
          <MeetingFieldDate selected={startDate} setStartDate={setStartDate} />
          <EuiSpacer />
          <CreateMeetingButtons createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  )
}