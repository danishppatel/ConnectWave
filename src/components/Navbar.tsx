import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { changeTheme } from "../app/slices/AuthSlice";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeader,
  EuiText,
  EuiTextColor,
} from "@elastic/eui";
import { getCreateMeetingBreadCrumbs, getDashboardBreadCrumbs, getMeetingsBreadCrumbs, getMyMeetingsBreadCrumbs, getOneOnOneMeetingBreadCrumbs, getVideoConferenceBreadCrumbs } from "../utils/breadcrumbs";
import IconButton from "./IconButton";
import sunTheme from '../assets/sun_theme.png';
import moonTheme from '../assets/moon_theme.png';
import logoutIcon from '../assets/logout.png'

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = useAppSelector((connectWave) => connectWave.auth.userInfo?.name);
  const isDarkTheme = useAppSelector((connectWave) => connectWave.auth.isDarkTheme);

  const [breadCrumbs, setBreadCrumbs] = useState([{ text: "Dashboard" }]);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 480);

  const dispatch = useDispatch();

  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/") {
      setBreadCrumbs(getDashboardBreadCrumbs(navigate));
    } else if (pathname === "/create") {
      setBreadCrumbs(getCreateMeetingBreadCrumbs(navigate));
    }else if (pathname === "/create1on1"){
      setBreadCrumbs(getOneOnOneMeetingBreadCrumbs(navigate));
    }else if (pathname === "/videoconference"){
      setBreadCrumbs(getVideoConferenceBreadCrumbs(navigate));
    }else if (pathname === "/mymeetings"){
      setBreadCrumbs(getMyMeetingsBreadCrumbs(navigate));
    }else if (pathname === "/meetings"){
      setBreadCrumbs(getMeetingsBreadCrumbs(navigate));
    }
    
  }, [location, navigate]);

  const logout = () => {
    signOut(firebaseAuth);
  };

  const invertTheme = () => {
    const theme = localStorage.getItem("connectwave-theme");
    localStorage.setItem("connectwave-theme", theme === "light" ? "dark" : "light");
    dispatch(changeTheme({ isDarkTheme: !isDarkTheme }));
  };

  const section = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#fff1e6" style={{fontFamily:"cursive"}}>ConnectWave </EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },
    {
      items: [
        <>
          {username ? (
            <EuiText>
              <h3>
                <EuiTextColor color="white" style={{fontFamily:"initial", letterSpacing:'0.1rem'}}>Hello, </EuiTextColor>
                <EuiTextColor color="#0b5cff" style={{fontFamily:"monospace", letterSpacing:'0.1rem'}}>{username} </EuiTextColor>
              </h3>
            </EuiText>
          ) : null}
        </>,
      ],
    },
    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {
                isDarkTheme ? (
                    <IconButton
                      icon={sunTheme}
                      ariaLabel="theme-button-light"
                      size={24}
                      color="#FFFF00"
                      onClick={invertTheme}
                    />
                ) : (

                    <IconButton
                    icon={moonTheme}
                    ariaLabel="theme-button-dark"
                    size={24}
                    color="#C0C0C0"
                    onClick={invertTheme}
                    />
                )
            }
          </EuiFlexItem>

          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            <IconButton
               icon={logoutIcon}
               ariaLabel="logout-button"
               size={24}
               color="#0096FF"
               onClick={logout}
            />
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];

  const responsiveSection = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#0b5cff" style={{fontFamily:"cursive"}}>ConnectWave</EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },
    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {
                isDarkTheme ? (
                    <IconButton
                      icon={sunTheme}
                      ariaLabel="theme-button-light-responsive"
                      size={24}
                      color="#FFFF00"
                      onClick={invertTheme}
                    />
                ) : (

                    <IconButton
                    icon={moonTheme}
                    ariaLabel="theme-button-dark-responsive"
                    size={22}
                    color="#C0C0C0"
                    onClick={invertTheme}
                    />
                )
            }
          </EuiFlexItem>

          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            <IconButton
               icon={logoutIcon}
               ariaLabel="logout-button-responsive"
               size={24}
               color="#0096FF"
               onClick={logout}
            />
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];

  useEffect(() => {
    
      const handleResize = () => {
        setIsResponsive(window.innerWidth < 480);
      };
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial check
  
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{position:"sticky", top:"0", zIndex:"1000"}}>
      <EuiHeader
        style={{ minHeight: "8vh" }}
        theme="dark"
        sections={isResponsive ? responsiveSection : section}
      />
      <EuiHeader
        style={{ minHeight: "7vh" }}
        sections={[
          {
            breadcrumbs: breadCrumbs,
          },
        ]}
      />
    </div>
  );
}

export default Navbar;
