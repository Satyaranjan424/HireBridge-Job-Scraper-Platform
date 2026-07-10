import { useState } from "react";
import { Camera } from "lucide-react";

import { changePassword, updateProfile } from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";
import { completion, toInputList, asList } from "../../utils/format";
import Toast from "../../components/ui/Toast";

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileForm({ role }) {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    ...user,
    skills: toInputList(user?.skills),
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const saved = await updateProfile({
        ...profile,
        skills: role === "STUDENT" ? asList(profile.skills) : undefined,
      });

      setUser(saved);

      setProfile({
        ...saved,
        skills: toInputList(saved.skills),
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadProfileImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    const dataUrl = await readFile(file);

    setProfile((current) => ({
      ...current,
      avatarUrl: dataUrl,
    }));

    setMessage("Profile image selected. Click Update Profile to save.");
  }

  async function uploadResume(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      setMessage("Resume must be under 6 MB.");
      return;
    }

    const dataUrl = await readFile(file);

    setProfile((current) => ({
      ...current,
      resumeUrl: dataUrl,
      resumeName: file.name,
    }));

    setMessage("Resume selected. Click Update Profile to save.");
  }

  async function submitPassword() {
    try {
      await changePassword(password);

      setPassword({
        currentPassword: "",
        newPassword: "",
      });

      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(error?.message || "Failed to change password.");
    }
  }

  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20";

  const fileClass =
    "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50";

  return (
    <form
      onSubmit={submit}
      className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]"
    >
      <Toast message={message} onClose={() => setMessage("")} />

      {/* ================= LEFT PROFILE CARD ================= */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-5xl font-bold text-amber-700">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0)
              )}
            </div>

            <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#F6B545] text-black shadow-lg transition hover:scale-105">
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadProfileImage}
              />
            </label>
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            {profile.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{profile.email}</p>

          <div className="mt-8 w-full rounded-2xl bg-slate-100 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-700">
                Profile Completion
              </span>
              <span className="text-lg font-bold text-slate-900">
                {completion(profile, role)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#F6B545]"
                style={{ width: `${completion(profile, role)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 w-full">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-5 text-xl font-bold text-slate-900">
                Change Password
              </h3>

              <div className="grid gap-4">
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Current Password"
                  value={password.currentPassword}
                  onChange={(event) =>
                    setPassword((p) => ({
                      ...p,
                      currentPassword: event.target.value,
                    }))
                  }
                />

                <input
                  type="password"
                  className={inputClass}
                  placeholder="New Password"
                  value={password.newPassword}
                  onChange={(event) =>
                    setPassword((p) => ({
                      ...p,
                      newPassword: event.target.value,
                    }))
                  }
                />

                <button
                  type="button"
                  onClick={submitPassword}
                  className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RIGHT EDIT PANEL ================= */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
          </div>

          <div className="grid gap-4">
            <input
              className={inputClass}
              placeholder="Professional Headline"
              value={profile.headline ?? ""}
              onChange={(event) =>
                setProfile((p) => ({
                  ...p,
                  headline: event.target.value,
                }))
              }
            />

            <input
              className={inputClass}
              placeholder="Location"
              value={profile.location ?? ""}
              onChange={(event) =>
                setProfile((p) => ({
                  ...p,
                  location: event.target.value,
                }))
              }
            />

            <textarea
              rows={5}
              className="rounded-xl border border-slate-200 px-4 py-3 text-[15px] outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20"
              placeholder="Bio"
              value={profile.bio ?? ""}
              onChange={(event) =>
                setProfile((p) => ({
                  ...p,
                  bio: event.target.value,
                }))
              }
            />

            {role === "STUDENT" ? (
              <>
                <input
                  className={inputClass}
                  placeholder="Skills (comma separated)"
                  value={profile.skills ?? ""}
                  onChange={(event) =>
                    setProfile((p) => ({
                      ...p,
                      skills: event.target.value,
                    }))
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Resume URL"
                  value={
                    profile.resumeUrl?.startsWith("data:")
                      ? profile.resumeName || "Uploaded Resume"
                      : profile.resumeUrl ?? ""
                  }
                  onChange={(event) =>
                    setProfile((p) => ({
                      ...p,
                      resumeUrl: event.target.value,
                    }))
                  }
                />

                <label className={fileClass}>
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={uploadResume}
                  />
                </label>
              </>
            ) : (
              <>
                <input
                  className={inputClass}
                  placeholder="Company Name"
                  value={profile.companyName ?? ""}
                  onChange={(event) =>
                    setProfile((p) => ({
                      ...p,
                      companyName: event.target.value,
                    }))
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Company Website"
                  value={profile.companySite ?? ""}
                  onChange={(event) =>
                    setProfile((p) => ({
                      ...p,
                      companySite: event.target.value,
                    }))
                  }
                />
              </>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex h-12 items-center justify-center rounded-xl bg-[#F6B545] px-8 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#E7A92E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}

