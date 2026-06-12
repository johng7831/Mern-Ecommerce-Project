import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { AuthContext } from "../../../context/AuthContext";

/* ── Inline SVG Icons ── */
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.32a2 2 0 0 1 1.99-1.8h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ── Avatar initials helper ── */
const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/* ── Component ── */
const Userprofile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    fullName: "", email: "", phone: "", address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type: 'success'|'error' }

  /* ── Fetch profile ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data.user ?? res.data;
        setProfile({
          fullName: d.fullName ?? d.name ?? "",
          email:    d.email ?? "",
          phone:    d.phone ?? "",
          address:  d.address ?? "",
        });
      } catch {
        showToast("Failed to load profile.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ── Toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── Save profile ── */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/user/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Profile updated successfully.", "success");
    } catch {
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Field change ── */
  const onProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (loading) return (
    <div className="up-state-wrap">
      <div className="up-spinner" />
      <p className="up-state-text">Loading profile…</p>
    </div>
  );

return (
    // Added a fallback style directly to the container to secure full width and overflow visibility
    <div className="up-root" style={{ width: "100%", minHeight: "100vh", overflow: "visible" }}>

      {/* ── Toast ── */}
      {toast && (
        <div className={`up-toast up-toast--${toast.type}`}>
          {toast.type === "success" ? <IconCheck /> : null}
          {toast.msg}
        </div>
      )}

      {/* ── Profile hero ── */}
      <div className="up-hero" style={{ width: "100%" }}>
        <div className="up-avatar-wrap">
          <div className="up-avatar">
            <span className="up-avatar-initials">{getInitials(profile.fullName) || "U"}</span>
          </div>
          <button className="up-avatar-edit" aria-label="Change photo">
            <IconCamera />
          </button>
        </div>
        <div className="up-hero-info">
          <h2 className="up-hero-name">{profile.fullName || "Your Name"}</h2>
          <p className="up-hero-email">{profile.email}</p>
        </div>
      </div>

      {/* ── Personal Info Form ── */}
      {/* Forcing standard box layout blocks to fill parent space safely */}
      <form className="up-form" onSubmit={handleSaveProfile} style={{ width: "100%", display: "block" }}>
        <div className="up-form-grid">

          <div className="up-field">
            <label className="up-label" htmlFor="fullName">Full Name</label>
            <div className="up-input-wrap">
              <span className="up-input-icon"><IconUser /></span>
              <input
                id="fullName" name="fullName" type="text"
                className="up-input" placeholder="John Doe"
                style={{ width: "100%" }}
                value={profile.fullName} onChange={onProfileChange}
              />
            </div>
          </div>

          <div className="up-field">
            <label className="up-label" htmlFor="email">Email Address</label>
            <div className="up-input-wrap">
              <span className="up-input-icon"><IconMail /></span>
              <input
                id="email" name="email" type="email"
                className="up-input" placeholder="you@example.com"
                style={{ width: "100%" }}
                value={profile.email} onChange={onProfileChange}
              />
            </div>
          </div>

          <div className="up-field">
            <label className="up-label" htmlFor="phone">Phone Number</label>
            <div className="up-input-wrap">
              <span className="up-input-icon"><IconPhone /></span>
              <input
                id="phone" name="phone" type="tel"
                className="up-input" placeholder="+91 98765 43210"
                style={{ width: "100%" }}
                value={profile.phone} onChange={onProfileChange}
              />
            </div>
          </div>

          <div className="up-field up-field--full">
            <label className="up-label" htmlFor="address">Delivery Address</label>
            <div className="up-input-wrap">
              <span className="up-input-icon up-input-icon--top"><IconMapPin /></span>
              <textarea
                id="address" name="address"
                className="up-input up-textarea" placeholder="Street, City, State, PIN"
                style={{ width: "100%", resize: "vertical" }}
                rows={3} value={profile.address} onChange={onProfileChange}
              />
            </div>
          </div>

        </div>

        <div className="up-form-footer">
          <button type="submit" className="up-save-btn" disabled={saving}>
            {saving ? <span className="up-btn-spinner" /> : <IconSave />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

    </div>
  );

};

export default Userprofile;