import { EuiDatePicker, EuiFormRow } from '@elastic/eui'
import moment from 'moment'
import React from 'react'

const MeetingFieldDate = ({
    selected,
    setStartDate
}:{
    selected: moment.Moment;
    setStartDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}) => {
  return (
    <EuiFormRow>
        <EuiDatePicker selected={selected} onChange={(date) => setStartDate(date!)}/>
    </EuiFormRow>
  )
}

export default MeetingFieldDate;