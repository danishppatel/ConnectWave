import React, { useCallback, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../app/hooks';
import { MeetingType, Page } from '../utils/types';
import { getDocs, query } from 'firebase/firestore';
import { meetingsRef } from '../utils/FirebaseConfig';
import Navbar from '../components/Navbar';
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer } from '@elastic/eui';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function Meeting() {
  useAuth();
  const userInfo = useAppSelector((connectWave) => connectWave.auth.userInfo);
  const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const getMyMeetings = useCallback(async () => {
    const firestoreQuery = query(meetingsRef);
    const fetchedMeetings = await getDocs(firestoreQuery);

    if (fetchedMeetings.docs.length) {
      const myMeetings: Array<MeetingType> = [];

      fetchedMeetings.forEach((meeting) => {
        const data = meeting.data() as MeetingType;

        if (data.createdBy === userInfo?.uid){
          myMeetings.push(meeting.data() as MeetingType);
        }

        else if (data.meetingType === "anyone-can-join"){
          myMeetings.push(meeting.data() as MeetingType);

        }
        else {
          const index = data.invitedUsers.findIndex(
            (user: string) => user === userInfo?.uid
          );

          if (index !== -1) {
            myMeetings.push(meeting.data() as MeetingType);
          }
        }
      });

      setTotalItemCount(myMeetings.length);

      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      setMeetings(myMeetings.slice(startIndex, endIndex));
    }
  }, [userInfo?.uid, pageIndex, pageSize]);

  useEffect(() => {
    if (userInfo) getMyMeetings();
  }, [userInfo, getMyMeetings]);

  const onTableChange = ({ page = {} as Page}) => {
    const { index: newPageIndex, size: newPageSize } = page;

    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };


  const meetingColumns = [
    {
      field: "meetingName",
      name: "Meeting Name",
    },
    {
      field: "meetingType",
      name: "Meeting Type",
    },
    {
      field: "meetingDate",
      name: "Meeting Date",
    },
    {
      field: "",
      name: "Status",
      render: (meeting: MeetingType) => {
        if (meeting.status) {
          if (meeting.meetingDate === moment().format("L")) {
            return (
              <EuiBadge color="success" style={{
                paddingTop: "3px",
                paddingBottom: "3px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              }}>

                <Link
                  to={`/join/${meeting.meetingId}`}
                  style={{ color: "black" }}
                >
                  Join Now
                </Link>
              </EuiBadge>
            );
          } else if (
            moment(meeting.meetingDate).isBefore(moment().format("L"))
          ) {
            return <EuiBadge color="default" style={{
              paddingTop: "3px",
              paddingBottom: "3px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}>Ended</EuiBadge>;
          } else if (moment(meeting.meetingDate).isAfter()) {
            return <EuiBadge color="primary" style={{
              paddingTop: "3px",
              paddingBottom: "3px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}>Upcoming</EuiBadge>;
          }
        } else return <EuiBadge color="danger" style={{
          paddingTop: "3px",
          paddingBottom: "3px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        }}>Cancelled</EuiBadge>;
      },
    },
    {
      field: "meetingId",
      name: "Copy Link",
      width: "10%",
      render: (meetingId: string) => {
        return (
          <EuiCopy
            textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}
          >
            {(copy: any) => (
              <EuiButtonIcon
                iconType="copy"
                onClick={copy}
                display="base"
                aria-label="meeting-copy"
                size="s"
                style={{ borderRadius: "4px" }}
              />
            )}
          </EuiCopy>
        );
      },
    },
  ];

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [5, 10],
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
    <EuiFlexGroup justifyContent="center" style={{ margin: "1rem 2rem" }}>
      <EuiFlexItem>
        <EuiPanel>
          <EuiBasicTable items={meetings} columns={meetingColumns} pagination={pagination}
              onChange={onTableChange} />
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
    <EuiSpacer/>
  </div>
  )
}
