import HiringManagerLayout from "../../layouts/HiringManagerLayout";
import ProfileForm from "../shared/ProfileForm";

export default function ManagerProfile() {
  return (
    <HiringManagerLayout
      active="profile"
      title="Profile"
    >
      <ProfileForm role="HIRING_MANAGER" />
    </HiringManagerLayout>
  );
}