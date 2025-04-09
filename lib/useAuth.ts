// lib/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useAuth() {
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          // Verificar si el usuario está activo
          if (!userDoc.exists() || userDoc.data()?.active === false) {
            await auth.signOut();
            setUser(null);
            setRole(null);
            localStorage.removeItem("userRole");
            return;
          }

          setRole(userDoc.data()?.role || null);
          localStorage.setItem("userRole", userDoc.data()?.role);
          setUser(firebaseUser);
        } catch (error) {
          console.error("Error verificando estado del usuario:", error);
          await auth.signOut();
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("userRole");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      // Validar usuario activo
      if (!userDoc.exists() || userDoc.data()?.active === false) {
        await logout();
        throw new Error("Tu cuenta ha sido desactivada");
      }

      setRole(userDoc.data()?.role || null);
      localStorage.setItem("userRole", userDoc.data()?.role);
      return userCredential.user;
    } catch (error) {
      await logout();
      throw new Error("Error en el inicio de sesión" + (error instanceof Error ? error.message : ""));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return { user, role, loading, login, logout };
}