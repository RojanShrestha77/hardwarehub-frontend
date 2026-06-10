import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl shadow-black/50 flex justify-center py-16">
          <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
