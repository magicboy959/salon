import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ForgotPasswordForm locale={locale} />;
}
