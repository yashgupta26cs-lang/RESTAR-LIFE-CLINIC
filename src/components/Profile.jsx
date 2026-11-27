import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import DoctorModal from "./DoctorModal.jsx";

const ProfileContext = createContext(() => {});

/** One doctor info popup for the whole app. Call `openProfile(doctor, { onBook, selected })` from any page. */
export function ProfileProvider({ children }) {
  const [state, setState] = useState(null);
  const openProfile = useCallback((doctor, opts = {}) => setState({ doctor, ...opts }), []);
  const close = useCallback(() => setState(null), []);
  // Browser back / any route change closes the popup.
  useEffect(() => {
    const on = () => setState(null);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return (
    <ProfileContext.Provider value={openProfile}>
      {children}
      {state && <DoctorModal key={state.doctor.id} doctor={state.doctor} onBook={state.onBook} selected={state.selected} onClose={close} />}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
