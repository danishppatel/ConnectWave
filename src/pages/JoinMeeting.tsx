import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { firebaseAuth, meetingsRef } from "../utils/FirebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import useToast from "../hooks/useToast";
import { getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { generateMeetingID } from "../utils/generateMeetingId";
import { ZegoSuperBoardManager } from "zego-superboard-web";

export default function JoinMeeting() {
  const params = useParams();
  const navigate = useNavigate();
  const [createToast] = useToast();
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [userLoaded, setUserLoaded] = useState(false);
  const zegoInstanceRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setUserLoaded(true);
    });

    return () => unsubscribe(); 
  }, []);
  
  useEffect(() => {
    const getMeetingData = async () => {
      if (params.id && userLoaded) {
        const firestoreQuery = query(
          meetingsRef,
          where("meetingId", "==", params.id)
        );
        const fetchedMeetings = await getDocs(firestoreQuery);

        if (fetchedMeetings.docs.length) {
          const meeting = fetchedMeetings.docs[0].data();
          const isCreator = meeting.createdBy === user?.uid;

          // For 1-on-1 meeting
          if (meeting.meetingType === "1-on-1") {
            if (meeting.invitedUsers[0] === user?.uid || isCreator) {
              if (meeting.meetingDate === moment().format("L")) {
                setIsAllowed(true);
              } else if (
                moment(meeting.meetingDate).isBefore(moment().format("L"))
              ) {
                createToast({ title: "Meeting has ended.", type: "danger" });
                navigate(user ? "/" : "/login");
              } else if (moment(meeting.meetingDate).isAfter()) {
                createToast({
                  title: `Meeting is on ${meeting.meetingDate}`,
                  type: "warning",
                });
                navigate(user ? "/" : "/login");
              }
            } else {
              navigate(user ? "/" : "/login");
            }
          }

          //For video-conference meeting
          else if (meeting.meetingType === "video-conference") {
            const index = meeting.invitedUsers.findIndex(
              (invitedUser: string) => invitedUser === user?.uid
            );
            if (index !== -1 || isCreator) {
              if (meeting.meetingDate === moment().format("L")) {
                setIsAllowed(true);
              } else if (
                moment(meeting.meetingDate).isBefore(moment().format("L"))
              ) {
                createToast({ title: "Meeting has ended.", type: "danger" });
                navigate(user ? "/" : "/login");
              } else if (moment(meeting.meetingDate).isAfter()) {
                createToast({
                  title: `Meeting is on ${meeting.meetingDate}`,
                  type: "warning",
                });
              }
            } else {
              createToast({
                title: `You are not invited to the meeting.`,
                type: "danger",
              });
              navigate(user ? "/" : "/login");
            }
          } else {
            setIsAllowed(true);
          }
        } else {
          navigate("/");
        }
      }
    };

    getMeetingData();
  }, [params.id, user, userLoaded, createToast, navigate]);

  // Assuming this is inside your JoinMeeting component
  const handleJoinMeeting = async (element: any) => {

    if(zegoInstanceRef.current){
      zegoInstanceRef.current.destroy(); 
    }


    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      parseInt(process.env.REACT_APP_ZEGOCLOUD_APP_ID!),
      process.env.REACT_APP_ZEGOCLOUD_SERVER_SECRET as string,
      params.id as string,
      user?.uid ? user.uid : generateMeetingID(),
      user?.displayName ? user.displayName : generateMeetingID()
    );

    // Create new instance
    const zp = ZegoUIKitPrebuilt.create(token);
    zegoInstanceRef.current = zp;


    zp.addPlugins({ ZegoSuperBoardManager });

    // Join room with the new instance
    zp.joinRoom({
      container: element,
      maxUsers: 50,
      sharedLinks: [
        {
          name: "Personal link",
          url: window.location.origin,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      layout: "Auto",
      onJoinRoom() {
        console.log("Joined the room successfully.");
      },
      onLeaveRoom() {
        console.log("Leave the room successfully.");
        cleanupAndNavigate();
        
      },
      whiteboardConfig: {
        showAddImageButton: true,
      },
    });
  };

  const cleanupAndNavigate = () => {
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.destroy(); 
      zegoInstanceRef.current = null;
    }
    navigate("/meetings"); 
  };

  useEffect(() => {
    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy(); 
      }
    };
  }, []);

  return isAllowed ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        className="myCallContainer"
        ref={handleJoinMeeting}
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </div>
  ) : (
    <></>
  );
}
