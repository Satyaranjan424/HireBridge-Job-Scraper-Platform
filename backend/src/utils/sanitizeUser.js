export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    headline: user.headline,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    skills: user.skills,
    resumeUrl: user.resumeUrl,
    companyName: user.companyName,
    companySite: user.companySite,
    location: user.location,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
