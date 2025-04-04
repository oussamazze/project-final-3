import React, { useState, useEffect } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";

const Header = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (token) {
    const decodedToken = decode(token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(setLogout());
    }
  }

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <MDBNavbar fixed="top" expand="lg" className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
      <MDBContainer>
        <MDBNavbarBrand href="/" className="brand">
          <MDBIcon icon="monument" className="brand-icon" /> Evopedia
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
          <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
            <MDBNavbarItem>
              <MDBNavbarLink href="/">Home</MDBNavbarLink>
            </MDBNavbarItem>
            {user?.result?._id && (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/addTour">Add tour</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/dashboard">Dashboard</MDBNavbarLink>
                </MDBNavbarItem>
                {/* Ajouter le bouton Favoris */}
                <MDBNavbarItem>
                  <MDBNavbarLink href="/favoris">Favoris</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/login" onClick={handleLogout}>Logout</MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {!user?.result?._id && (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">Login</MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
      <style>
        {`
          .navbar-custom {
            background-color: rgba(255, 255, 255, 0.95);
            transition: all 0.3s ease-in-out;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .navbar-custom.scrolled {
            background-color: rgba(0, 0, 0, 0.8);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .brand {
            font-weight: 700;
            font-size: 24px;
            color: #4b4b4d;
            transition: transform 0.3s ease-in-out;
          }
          .brand-icon {
            margin-right: 10px;
            color: #ff6f61;
          }
          .navbar-custom.scrolled .brand {
            transform: scale(0.9);
          }
          .navbar-custom.scrolled .brand-icon {
            color: white;
          }
          .navbar-custom .nav-link {
            color: #4b4b4d;
            transition: color 0.3s ease-in-out;
          }
          .navbar-custom.scrolled .nav-link {
            color: white;
          }
          .nav-link:hover {
            color: #ff6f61 !important;
          }
        `}
      </style>
    </MDBNavbar>
  );
};

export default Header;
