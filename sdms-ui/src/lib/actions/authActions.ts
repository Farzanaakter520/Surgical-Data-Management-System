import { API_BASES } from "@/lib/config/app-config";


export type LoginResponse = {
  token: string;
  user: { id: string; first_name: string;last_name: string; email: string };
};

export class AuthAction {
  constructor(private service: keyof typeof API_BASES) {}

  private buildUrl(endpoint: string): string {
    const envBase = process.env.NEXT_PUBLIC_SDMS_API_BASE;
    const safeEnvBase =
      envBase && envBase !== "undefined" && envBase !== "null" ? envBase : "";
    const base = API_BASES[this.service] || safeEnvBase || "http://localhost:8000/api/v1";

    const normalizedBase = base.replace(/\/+$/, "");
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return `${normalizedBase}${normalizedEndpoint}`;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginUrl = this.buildUrl(`/auth/login`);
    console.log(loginUrl);

    let res: Response;
    try {
      res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
    } catch (error: any) {
      throw new Error(
        `Login request failed for ${loginUrl}. ${error?.message || "Network error"}`
      );
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Login failed");
    }
    const result = await res.json();
    // console.log(result.data);
    // console.log(result.user);
    return { token: result.data.token, user: result.data.user };
  }

  
}
