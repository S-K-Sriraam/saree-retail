export function isConfiguredAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return adminEmails
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
