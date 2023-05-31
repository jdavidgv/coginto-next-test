import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSignup = async () => {
    const userData = {
      user_name: username,
      email,
      full_name: fullName,
      user_password: password,
      user_role: "509e1b1b-37cf-4be2-9611-41694f6b0e89",
      account_type: "private",
      registration_type: "notery",
      status: "enabled",
    };
    const URL_STAGING= "https://10lxhwxwf1.execute-api.us-east-1.amazonaws.com/staging"
    const URL_DEV= "https://86r25v5yvd.execute-api.us-east-1.amazonaws.com/dev"

    fetch(`${URL_STAGING}/notery/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuario registrado:", data);
        router.push('login')
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
      });
  };
  async function confirmSignUp(code) {
    try {
      let response = await Auth.confirmSignUp(email, code);

      if (response == "SUCCESS") router.push("home");
      else router.push("/");
      console.log(response);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }
  return (
    <>
      <div className="login-container">
        <h2>Signup with AWS Cognito</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
        <input type="email" required={true} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" required={true} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <div className="container-actions-form">
          <button onClick={onSignup}> Signup</button>
        </div>
      </div>
    </>
  );
}
