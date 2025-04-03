"use client";
import React, { useEffect, useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import SearchInput from "./SearchInput";
import Social from "./Social";
import Action from "./Action";
import "./NavCss/nav.css";
import Link from "next/link";
import NavSidebar from "../NavSidebar/NavSidebar";

const Navbar = ({ lang, setProfiIsOpen }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  const showTogg = () => {
    if (showFloat) {
      setShowFloat(false);
    } else {
      setShowFloat(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (scrollPosition > 0 && isScrolled === false) {
        setIsScrolled(true);
      } else if (scrollPosition === 0) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  const toggleProfile = () => setProfiIsOpen(true);

  const [siteName, setSiteName] = useState("Animoon");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname; // Get the full domain
      const subdomain = hostname.split(".")[0]; // Extract subdomain

      // Change text based on subdomain
      setSiteName(subdomain);
    }
  }, []);

  return (
    <div>
      <NavSidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
        lang={lang}
      />
      <div className={`nav-1 ${isScrolled ? "darkio" : ""}`}>
        <div className="nav-in">
          <div onClick={() => setSidebarIsOpen(true)} className="barr">
            <FaBars size={25} />
          </div>
          <div>
            <Link href="/">
              <div className="logo-container">
                <div className="logo-icon"></div>
                <div className="logo-text">{siteName}</div>
              </div>
            </Link>
          </div>
          <div className="searc">
            <SearchInput />
          </div>
          <div className="social-links">
            <Social />
          </div>
          <div className="nav-action">
            <Action lang={lang} />
          </div>
        </div>
        <div className="nav-end">
          <div className="nav-ser" onClick={() => showTogg()}>
            <FaSearch />
          </div>
          <img
            src={"https://hianime.to/images/no-avatar.jpeg"}
            className="profile-ico"
            onClick={toggleProfile}
            alt={"user"}
          />
        </div>
      </div>
      {showFloat && (
        <div className="float-ser">
          <SearchInput float={true} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
