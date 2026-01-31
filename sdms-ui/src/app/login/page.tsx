import LoginForm from "./login.form.component";

export default function LoginPage() {
  return (
    <main 
      className="min-h-dvh relative flex items-center justify-center p-4 overflow-hidden"
      >
      {/* White overlay for better contrast */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

      {/* Main content container with enhanced styling */}
      <div className="relative w-full max-w-[420px] ">
        {/* Subtle inner glow */}
        {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 via-transparent to-blue-50/20 pointer-events-none"></div> */}
        
        {/* Content */}
        <div className="relative z-10">
          <LoginForm />
        </div>
      </div>

      {/* Additional ambient lighting effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
    </main>
  );
}