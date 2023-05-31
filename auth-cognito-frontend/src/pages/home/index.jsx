import { Hub, Auth, Amplify } from "aws-amplify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log(event, data);
      switch (event) {
        case "signIn":
          console.log(data);
          setUser(data);
          break;
        case "signOut":
          console.log(data);
          setUser(null);
          break;
        case "customOAuthState":
          console.log(data);
          setCustomState(data);
      }
    });
    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        console.log("USE THIS TOKEN: ",currentUser.signInUserSession.idToken.jwtToken);
        console.log("USER INFO: ", currentUser.signInUserSession.idToken.payload);
        setUser(currentUser);
      })
      .catch((error) => console.log("Not signed in", error));

    return unsubscribe;
  }, []);

  const logout = () => {
    Auth.signOut({ returnTo: "http://localhost:3000/login" })
      .then(() => {
        console.log("Usuario desconectado");
        router.push("login");
      })
      .catch((error) => {
        console.error("Error al desconectar usuario:", error);
      });
  };
  return (
    <>
      <div className="home-container">
        <h1> This is a Home page after login</h1>{" "}
        <div>
          {" "}
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
}
