import { useContext, useState } from "react";
import { FirebaseContext } from "../context/firebase";
import { useUserInterests } from "./useUserInterests";

export const useAuth = () => {
  const { auth, user, setUser } = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const {createUserData} = useUserInterests();

  const signUpWithEmailAndPassword = (email, interests = [], password) => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        createUserData(email, interests)
          .then(() => setUser(user))
          .catch(setError); // TODO: handle error
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const signInWithEmailAndPassword = (email, password) => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => setUser(user))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const logOut = () => {
    auth.signOut();
    setUser(null);
    localStorage.removeItem("email");
    window.location.reload();
  };

  return {
    user,
    error,
    loading,
    signUp: signUpWithEmailAndPassword,
    signIn: signInWithEmailAndPassword,
    logOut
  };
};
