import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import DoctorModal from "./DoctorModal.jsx";
import FacilityModal from "./FacilityModal.jsx";

const ProfileContext = createContext(() => {});
const FacilityContext = createContext(() => {});

/**
 * One doctor popup and one facility popup for the whole app.
 *   openProfile(doctor, { onBook, selected })   openFacility(facility)
 */
export function ProfileProvider({ children }) {
  const [state, setState] = useState(null);
  const openProfile = useCallback((doctor, opts = {}) => setState({ kind: "doctor", doctor, ...opts }), []);
  const openFacility = useCallback((facility) => setState({ kind: "facility", facility }), []);
  const close = useCallback(() => setState(null), []);
  // Browser back / any route change closes the popup.
  useEffect(() => {
    const on = () => setState(null);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return (
    <ProfileContext.Provider value={openProfile}>
      <FacilityContext.Provider value={openFacility}>
        {children}
        {state?.kind === "doctor" && <DoctorModal key={state.doctor.id} doctor={state.doctor} onBook={state.onBook} selected={state.selected} onClose={close} />}
        {state?.kind === "facility" && <FacilityModal key={state.facility.id} facility={state.facility} onClose={close} />}
      </FacilityContext.Provider>
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
export const useFacilityInfo = () => useContext(FacilityContext);
