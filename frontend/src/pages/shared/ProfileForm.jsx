import { useState } from 'react';
import { changePassword, updateProfile } from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';
import { completion, toInputList, asList } from '../../utils/format';
import Toast from '../../components/ui/Toast';

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
  const [profile, setProfile] = useState({ ...user, skills: toInputList(user.skills) });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await updateProfile({
        ...profile,
        skills: role === 'STUDENT' ? asList(profile.skills) : undefined,
      });
      setUser(saved);
      setProfile({ ...saved, skills: toInputList(saved.skills) });
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadProfileImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      return;
    }
    const dataUrl = await readFile(file);
    setProfile((current) => ({ ...current, avatarUrl: dataUrl }));
    setMessage('Profile image selected. Click Update Profile to save.');
  }

  async function uploadResume(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setMessage('Resume must be under 6 MB.');
      return;
    }
    const dataUrl = await readFile(file);
    setProfile((current) => ({ ...current, resumeUrl: dataUrl, resumeName: file.name }));
    setMessage('Resume selected. Click Update Profile to save.');
  }

  async function submitPassword() {
    try {
      await changePassword(password);
      setPassword({ currentPassword: '', newPassword: '' });
      setMessage('Password changed.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="profile-grid" onSubmit={submit}>
      <Toast message={message} onClose={() => setMessage('')} />
      <section className="panel profile-summary">
        <div className="avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} /> : profile.name?.slice(0, 1)}</div>
        <h3>{profile.name}</h3>
        <p>{profile.email}</p>
        <strong>{completion(profile, role)}%</strong>
        <span>Profile Completion</span>
        <label className="file-button">
          Select Profile Image
          <input type="file" accept="image/*" onChange={uploadProfileImage} />
        </label>
      </section>
      <section className="panel form-grid">
        <h3>Edit Profile</h3>
        {['name', 'phone', 'headline', 'location'].map((field) => <input key={field} placeholder={field} value={profile[field] ?? ''} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} />)}
        <textarea placeholder="Bio" value={profile.bio ?? ''} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
        {role === 'STUDENT' ? (
          <>
            <input placeholder="Skills, comma separated" value={profile.skills ?? ''} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} />
            <input placeholder="Resume URL" value={profile.resumeUrl?.startsWith('data:') ? profile.resumeName || 'Uploaded resume selected' : profile.resumeUrl ?? ''} onChange={(event) => setProfile({ ...profile, resumeUrl: event.target.value })} />
            <label className="file-button">
              Upload Resume
              <input type="file" accept=".pdf,.doc,.docx" onChange={uploadResume} />
            </label>
          </>
        ) : (
          <>
            <input placeholder="Company Name" value={profile.companyName ?? ''} onChange={(event) => setProfile({ ...profile, companyName: event.target.value })} />
            <input placeholder="Company Website" value={profile.companySite ?? ''} onChange={(event) => setProfile({ ...profile, companySite: event.target.value })} />
          </>
        )}
        <div className="password-box">
          <h3>Change Password</h3>
          <input type="password" placeholder="Current password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} />
          <input type="password" placeholder="New password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} />
          <button type="button" onClick={submitPassword}>Change Password</button>
        </div>
        <div className="actions"><button className="primary" disabled={saving}>{saving ? 'Saving' : 'Update Profile'}</button></div>
      </section>
    </form>
  );
}
