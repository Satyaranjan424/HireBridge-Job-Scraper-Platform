import ProfileForm from '../shared/ProfileForm';
import StudentLayout from '../../layouts/StudentLayout';

export default function StudentProfile() {
  return (
    <StudentLayout active="profile" title="Profile">
      <ProfileForm role="STUDENT" />
    </StudentLayout>
  );
}
