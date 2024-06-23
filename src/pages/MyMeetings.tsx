import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { MeetingType, Page } from "../utils/types";
import { getDocs, query, where } from "firebase/firestore";
import { meetingsRef } from "../utils/FirebaseConfig";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import {
  EuiBadge,
  EuiBasicTable,
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
} from "@elastic/eui";
import moment from "moment";
import { Link } from "react-router-dom";
import EditFlyOut from "../components/EditFlyOut";

export default function MyMeetings() {
  useAuth();
  const userInfo = useAppSelector((connectWave) => connectWave.auth.userInfo);

  const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  const [showEditFlyout, setShowEditFlyout] = useState(false);
  const [editMeeting, setEditMeeting] = useState<MeetingType>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const getMyMeetings = useCallback(async () => {
    const firestoreQuery = query(
      meetingsRef,
      where("createdBy", "==", userInfo?.uid)
    );

    const fetchedMeetings = await getDocs(firestoreQuery);

    if (fetchedMeetings.docs.length) {
      const myMeetings: Array<MeetingType> = [];

      fetchedMeetings.forEach((meeting) => {
        myMeetings.push({
          docId: meeting.id,
          ...(meeting.data() as MeetingType),
        });
      });

      setTotalItemCount(myMeetings.length);

      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      setMeetings(myMeetings.slice(startIndex, endIndex));
    }
  }, [userInfo?.uid, pageIndex, pageSize]);

  useEffect(() => {
    if (userInfo) {
      getMyMeetings();
    }
  }, [userInfo, getMyMeetings]);

  const openEditFlyout = (meeting: MeetingType) => {
    setShowEditFlyout(true);
    setEditMeeting(meeting);
  };

  const closeEditFlyout = (dataChanged = false) => {
    setShowEditFlyout(false);
    setEditMeeting(undefined);

    if (dataChanged) {
      getMyMeetings();
    }
  };

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
      width: "10%",
      render: (meeting: MeetingType) => {
        if (meeting.status) {
          if (meeting.meetingDate === moment().format("L")) {
            return (
              <EuiBadge
                color="success"
                style={{
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
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
            return (
              <EuiBadge
                color="default"
                style={{
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                Ended
              </EuiBadge>
            );
          } else if (moment(meeting.meetingDate).isAfter()) {
            return (
              <EuiBadge
                color="primary"
                style={{
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                Upcoming
              </EuiBadge>
            );
          }
        } else
          return (
            <EuiBadge
              color="danger"
              style={{
                paddingTop: "3px",
                paddingBottom: "3px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              Cancelled
            </EuiBadge>
          );
      },
    },
    {
      field: "",
      name: "Edit",
      width: "5%",
      render: (meeting: MeetingType) => {
        return (
          <EuiButtonIcon
            aria-label="meeting-edit"
            iconType="indexEdit"
            color="danger"
            display="base"
            isDisabled={
              moment(meeting.meetingDate).isBefore(moment().format("L")) ||
              !meeting.status
            }
            onClick={() => openEditFlyout(meeting)}
          />
        );
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
    pageSizeOptions: [5,10],
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
      <EuiFlexGroup justifyContent="center" style={{ margin: "1rem 2rem"}}>
        <EuiFlexItem>
          <EuiPanel>
            <EuiBasicTable items={meetings} columns={meetingColumns}  pagination={pagination}
              onChange={onTableChange}/>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
      {showEditFlyout && (
        <EditFlyOut closeFlyout={closeEditFlyout} meeting={editMeeting!} />
      )}
    </div>
  );
}
