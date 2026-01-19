import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import "../styles/profile.css";
import { loadMe } from "../app/slices/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= REDUX ================= */
  const { user, loading } = useSelector(state => state.auth);

  /* ================= LOCAL STATE ================= */
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!user) dispatch(loadMe());
  }, [dispatch, user]);

  useEffect(() => {
  if (user && !edit) {
    setForm(user);
    setOriginalForm(user);
  }
}, [user, edit]);

  /* ================= PASSWORD STRENGTH ================= */
  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { label: "Weak", color: "red", width: "25%" };
    if (score === 2) return { label: "Fair", color: "orange", width: "50%" };
    if (score === 3) return { label: "Good", color: "#2874f0", width: "75%" };
    return { label: "Strong", color: "green", width: "100%" };
  }, [newPassword]);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = useCallback(async () => {
    try {
      await api.put("/user/update", {
        name: form.name,
        phone: form.phone,
        addresses: form.addresses
      });

      dispatch(loadMe());
      setEdit(false);

      Swal.fire("Updated", "Profile updated successfully", "success");
    } catch {
      Swal.fire("Error", "Profile update failed", "error");
    }
  }, [form, dispatch]);

  /* ================= CANCEL EDIT ================= */
  const cancelEdit = () => {
    setForm(originalForm);
    setEdit(false);
  };

  /* ================= PASSWORD OTP ================= */
  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Swal.fire("Weak Password", "Minimum 6 characters", "warning");
      return;
    }

    try {
      await api.post("/auth/send-profile-otp",{
        newPassword
      });
      navigate("/verify-password-otp");
    } catch {
      Swal.fire("Error", "Failed to send OTP", "error");
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    const confirm = await Swal.fire({
      title: "Delete Account?",
      text: "This will permanently delete your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33"
    });

    if (confirm.isConfirmed) {
      await api.delete("/user/delete");
      localStorage.clear();
      navigate("/register");
    }
  };

  /* ================= ADDRESS EDIT ================= */
  const updateAddress = (i, field, value) => {
    const updated = [...form.addresses];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, addresses: updated });
  };

  if (loading || !form) return <h2>Loading profile...</h2>;

  return (
    <div className="profile-page">
      {/* ================= AVATAR ================= */}
      <div className="profile-avatar">
        <div className="avatar-circle">{form.name?.[0]}</div>
        <p className="upload-text">{form.name}</p>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="profile-card">
        <input
          disabled={!edit}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        {/* 🔒 EMAIL READ-ONLY */}
        <input disabled value={form.email} />

        <input
          disabled={!edit}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        {!edit ? (
          <button onClick={() => setEdit(true)}>Edit Profile</button>
        ) : (
          <div className="btn-row">
            <button onClick={saveProfile}>Save</button>
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}

        {/* ================= ADDRESSES ================= */}
        <h3 className="section-title">Saved Addresses</h3>

        {form.addresses.map((addr, i) => (
          <div key={addr._id} className="address-card">
            {edit ? (
              <>
                <input
                  value={addr.doorNo}
                  onChange={e => updateAddress(i, "doorNo", e.target.value)}
                />
                <input
                  value={addr.street}
                  onChange={e => updateAddress(i, "street", e.target.value)}
                />
                <input
                  value={addr.line1}
                  onChange={e => updateAddress(i, "line1", e.target.value)}
                />
                <input
                  value={addr.pincode}
                  onChange={e => updateAddress(i, "pincode", e.target.value)}
                />
              </>
            ) : (
              <>
                <p>{addr.doorNo}, {addr.street}</p>
                <p>{addr.line1}</p>
                <p>Pincode: {addr.pincode}</p>
              </>
            )}
          </div>
        ))}

        {/* ================= PASSWORD ================= */}
        <h3 className="section-title">Change Password</h3>

        <input
        disabled={!edit}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        {newPassword && (
          <div className="password-strength">
            <div
              className="strength-bar"
              style={{ width: strength.width, background: strength.color }}
            />
            <small style={{ color: strength.color }}>{strength.label}</small>
          </div>
        )}

        <button onClick={changePassword}>
          Verify via Email OTP
        </button>

        <hr />

        <div className="profile-actions">
        <button className="action-btn" onClick={() => navigate("/orders")}>
          Purchase History
        </button>

        <button className="action-btn" onClick={() => navigate("/cart")}>
          My Cart
        </button>
        </div>

        <hr />

        <button className="delete-btn" onClick={deleteAccount}>
          Delete My Account
        </button>
      </div>
    </div>
  );
}






