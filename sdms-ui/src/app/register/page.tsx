// app/user-form/page.tsx

import RegisterFormPage from "./register.form.component";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <RegisterFormPage />
    </section>
  );
}
