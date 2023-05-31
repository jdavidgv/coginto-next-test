import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

import { useRouter } from "next/router";
import { useState } from "react";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      await Auth.signIn(username, password);
      console.log("Success!!, Login Successfully", "success");
      router.push("/home");
    } catch (error) {
      alert("Error!!");
    }
  };
  
  const onSignin = () => {
    router.push("signup");
  };

  return (
    <>
      <div className="login-container">
        <h2>Login with AWS Cognito</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <div className="container-actions-form">
          <button onClick={onLogin}> Login</button>
          <a onClick={onSignin}>Sign up</a>

          <button
            onClick={() => {
              Auth.federatedSignIn({ provider: "Google" });
            }}
          >
            Login with Google
          </button>
          <button
            onClick={() => {
              Auth.federatedSignIn({ provider: "Facebook" });
            }}
          >
            Login with Facebook
          </button>
        </div>
      </div>
    </>
  );
}
