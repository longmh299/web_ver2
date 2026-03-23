"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type State = { error?: string } | null;

export async function loginAction(
  _prev: State,
  formData: FormData
): Promise<State> {
  const user = String(formData.get("user") ?? "");
  const pass = String(formData.get("pass") ?? "");
  const next = (formData.get("next") as string) || "/admin";

  const U = process.env.ADMIN_USER || "admin";
  const P = process.env.ADMIN_PASS || "admin123";

  if (user !== U || pass !== P) {
    return { error: "Sai tài khoản hoặc mật khẩu" };
  }

  // Server Action: phải await cookies()
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h
  });

  // tránh open-redirect
  const safeNext = next.startsWith("/") ? next : "/admin";
  redirect(safeNext);
}

export async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/admin/login");
}
