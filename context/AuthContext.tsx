import type { Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { isRegistrationInProgress } from "../services/authService";

/**
 * Kontrak tipe untuk AuthContext.
 * Mengelola status autentikasi global yang disebarkan ke seluruh aplikasi.
 */
export interface AuthContextType {
  /** Session aktif Supabase atau null jika pengguna belum login */
  session: Session | null;
  /** Objek user Supabase yang terotentikasi atau null */
  user: User | null;
  /** Status pemulihan sesi awal (rehydration). Bernilai true saat aplikasi memeriksa storage awal */
  isLoading: boolean;
  /** Fungsi resmi untuk mengakhiri sesi dan membersihkan state auth seketika */
  signOut: () => Promise<void>;
}

/**
 * Context autentikasi global CareFam.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider membungkus aplikasi dan menyediakan status sesi Supabase global.
 * - CHECKPOINT 2: Rehidrasi sesi awal (initial session) saat startup.
 * - CHECKPOINT 3: Berlangganan perubahan status auth secara real-time via onAuthStateChange().
 * - CHECKPOINT 5: Mekanisme signOut sinkron & lokal untuk mencegah race condition.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    /**
     * CHECKPOINT 2: Mengambil sesi awal tersimpan (rehydration)
     */
    const rehydrateSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "[AuthContext] Gagal memulihkan sesi awal:",
            error.message,
          );
        }

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(
            "[AuthContext] Kesalahan tak terduga saat rehidrasi sesi:",
            err.message,
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    rehydrateSession();

    /**
     * CHECKPOINT 3: Berlangganan event autentikasi Supabase secara real-time.
     * Menangani INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, dan TOKEN_REFRESHED.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;

      // Cegah sesi otomatis dari proses registrasi baru agar pengguna tidak langsung diarahkan ke Dashboard
      if (
        isRegistrationInProgress() &&
        (event === "SIGNED_IN" || event === "USER_UPDATED")
      ) {
        return;
      }

      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
          break;

        case "SIGNED_OUT":
          setSession(null);
          setUser(null);
          setIsLoading(false);
          break;

        default:
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
          break;
      }
    });

    /**
     * Cleanup subscription saat provider unmount untuk mencegah memory leak.
     */
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * CHECKPOINT 5: Sign Out terkoordinasi
   * Menjamin pembersihan state lokal React seketika untuk mencegah Route Guard memantulkan
   * navigasi kembali ke dashboard, lalu membersihkan token di SecureStore dan Supabase.
   */
  const signOut = async () => {
    // 1. Bersihkan state lokal React secara instan
    setSession(null);
    setUser(null);

    // 2. Jalankan signOut pada Supabase dan bersihkan storage lokal SecureStore
    try {
      await supabase.auth.signOut();
    } catch {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Silent fallback
      }
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook untuk mengakses status autentikasi global.
 * Menjamin type-safety dan melempar error deskriptif jika digunakan di luar AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
