import React from "react";
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { useNavigate } from "react-router-dom";

interface CreateMeetingButtonsProps {
  createMeeting: () => void;
  isEdit?: boolean;
  closeFlyout?: () => void;
}

const CreateMeetingButtons: React.FC<CreateMeetingButtonsProps> = ({
  createMeeting,
  isEdit = false,
  closeFlyout,
}) => {
  const navigate = useNavigate();

  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiButton
          color="danger"
          onClick={() => (isEdit ? closeFlyout!() : navigate("/"))}
          fill
        >
          Cancel
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton type="submit" onClick={createMeeting} fill>
          {isEdit ? "Edit Meeting" : "Create Meeting"}
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default CreateMeetingButtons;
