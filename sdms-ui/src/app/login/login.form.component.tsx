"use client";

import { useTransition, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { loginAction } from "./actions";
import { useAuth } from "@/contexts/auth-context";

// Validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = (data: LoginFormValues) => {
  setServerError(null);
  startTransition(async () => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginAction(formData); // server action
     // console.log(result)
      if (result?.success) {
        login(result?.user); // update auth context
        router.push("/dashboard"); // redirect after login
      } else {
        setServerError(result.error || "User id or password incorrect");
        setFocus("email");
      }
    } catch (err: any) {
      setServerError(err.message || "Login failed");
      setFocus("email");
    }
  });
};

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-lg border w-full max-w-sm",
        "bg-background border-border"
      )}
      aria-label="Login card"
    >
      {/* Top gradient header with corner SVGs */}
      <div className="relative h-32 bg-gradient-to-tr from-[#37C7D4] via-[#4CC9F0] to-[#7AD3FF] dark:from-[#1e3a8a] dark:via-[#2563eb] dark:to-[#38bdf8] overflow-hidden">
        {/* Top-left SVG */}
        <svg
          className="absolute top-0 left-0 w-20 h-20 -translate-x-6 -translate-y-6 opacity-30"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="white" className="dark:fill-gray-800" />
        </svg>

        {/* Top-right SVG */}
        <svg
          className="absolute top-0 right-0 w-24 h-24 translate-x-6 -translate-y-8 opacity-20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="white" className="dark:fill-gray-700" />
        </svg>

        {/* Center header content */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 flex items-center gap-2 text-white drop-shadow-sm">
          <div className="size-8 rounded-full bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
            <User2 className="size-6" aria-hidden="true" />
          </div>
          <span className="text-base font-semibold tracking-wide">
            Login to SDMS
          </span>
        </div>

        {/* Bottom wave */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px left-0 h-12 w-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,112 480,16 720,40 C960,64 1200,128 1440,88 L1440,120 L0,120 Z"
            className="fill-background"
          />
        </svg>

        {/* Info text */}
        <span className="absolute top-12 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground">
          Enter your credentials to access 
        </span>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 pb-5 pt-3">
        <div className="mt-4 space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <div className="relative">
              <User2
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                id="email"
                type="email"
                placeholder="user id"
                autoComplete="username"
                aria-invalid={!!errors.email}
                className={cn(
                  "pl-10 h-10 rounded-lg text-sm",
                  errors.email && "ring-2 ring-red-500"
                )}
                {...register("email")}
                ref={(el) => {
                  register("email").ref(el);
                  emailRef.current = el!;
                }}
                disabled={isPending}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className={cn(
                  "pl-10 pr-10 h-10 rounded-lg text-sm",
                  errors.password && "ring-2 ring-red-500"
                )}
                {...register("password")}
                disabled={isPending}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                disabled={isPending}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:underline"
              >
                forgot password?
              </a>
            </div>
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/30 p-2 rounded-md"
            >
              {serverError}
            </motion.p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg text-sm font-semibold uppercase tracking-wider",
              "bg-gradient-to-r from-[#37C7D4] via-[#4CC9F0] to-[#9B5DE5] text-white",
              "hover:opacity-95 disabled:opacity-60"
            )}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* New User Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-center"
          >
            {/* <a
              href="/register"
              className="text-xs text-[#4CC9F0] hover:underline font-medium dark:text-[#38bdf8]"
            >
              New user? Register
            </a> */}
          </motion.div>
        </div>

        {/* Pagination dots */}
        <div className="mt-3 flex items-center justify-center gap-1 pb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B8B8B8] dark:bg-gray-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#5CC5F0] dark:bg-[#38bdf8]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#B8B8B8] dark:bg-gray-600" />
        </div>
      </form>
      <div className="text-right text-xs text-muted-foreground px-3 pb-2">
        poweredby:&copy;wevics
      </div>
    </motion.section>
  );
}