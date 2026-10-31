import { LoginContent } from "../types";

// RUBRIK: Type & Array of Objects
export const LOGIN_CONTENT: LoginContent[] = [
  {
    id: 1,
    role: "user",
    title: "",
    subtitle: "",
    buttonLabel: "Masuk",
    accentColor: "#2563EB",
    altLabel: "Masuk sebagai admin",
    altRoute: "/admin/login",
  },
  {
    id: 2,
    role: "admin",
    title: "Admin Login",
    subtitle: "Masuk menggunakan akun admin",
    buttonLabel: "Masuk sebagai Admin",
    accentColor: "#2563EB",
    altLabel: "Kembali ke login pengguna",
    altRoute: "/login",
  },
];
