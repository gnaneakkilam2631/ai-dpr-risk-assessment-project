import React, { useEffect, useState } from "react";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  picture?: string;
  role?: string;
}

export function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser: UserProfile =
        JSON.parse(storedUser);

      setUser(parsedUser);
      setName(parsedUser.name || "");
    } catch (err) {
      console.error(
        "Unable to read stored user:",
        err
      );
    }
  }, []);


  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Keep Gmail/email unchanged.
       * Only the display name is editable.
       */

      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
      };

      /*
       * Update local application user immediately.
       */

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setMessage(
        "Profile updated successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your AI-DPR Guardian profile.
        </p>
      </div>


      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        {/* PROFILE HEADER */}

        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">

          {/* AVATAR */}

          {user?.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {(
                user?.name ||
                user?.email ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || "User"}
            </h2>

            <p className="text-sm text-gray-500">
              {user?.email || "Email unavailable"}
            </p>
          </div>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSave}
          className="mt-6 space-y-5"
        >

          {/* NAME */}

          <div>

            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Gmail / Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={user?.email || ""}
              disabled
              readOnly
              className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Your Google account email cannot be changed.
            </p>

          </div>


          {/* ROLE */}

          <div>

            <label
              htmlFor="profile-role"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Role
            </label>

            <input
              id="profile-role"
              type="text"
              value={
                user?.role || "DPR Evaluator"
              }
              disabled
              readOnly
              className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-500"
            />

          </div>


          {/* SUCCESS */}

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          {/* SAVE */}

          <div className="flex justify-end pt-2">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}