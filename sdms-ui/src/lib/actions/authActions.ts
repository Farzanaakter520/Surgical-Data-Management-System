import { API_BASES } from "@/lib/config/app-config";


export type LoginResponse = {
  token: string;
  user: { id: string; first_name: string;last_name: string; email: string };
};

export class AuthAction {
  constructor(private service: keyof typeof API_BASES) {}

  private buildUrl(endpoint: string): string {
    return `${API_BASES[this.service]}${
      endpoint.startsWith("/") ? endpoint : "/" + endpoint
    }`;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log(this.buildUrl(`/auth/login`));
    const res = await fetch(this.buildUrl(`/auth/login`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

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
