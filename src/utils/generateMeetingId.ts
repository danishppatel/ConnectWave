export const generateMeetingID = () => {
    let meetingID = "";
    const chars =
      "12345qwertyuiopasdfgh67890jklmnbvcxz26zXp3qlMNBVCZXASDQWERTYHGFUIOLKJP1X7EW";
    const maxPos = chars.length;
  
    for (let i = 0; i < 8; i++) {
      meetingID += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return meetingID;
  };