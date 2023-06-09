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
        console.log("USE THIS TOKEN: ", currentUser.signInUserSession.idToken.jwtToken);
        console.log("USER INFO: ", currentUser.signInUserSession.idToken.payload);
        setUser(currentUser);
      })
      .catch((error) => console.log("Not signed in", error));

    return unsubscribe;
  }, []);

  const uploadFile = async (file) => {
    fetch("https://notery-bucket-dev.s3.amazonaws.com/b1e4e4d4-7265-45c2-b4e4-644ec7dead36/test_user/8132c88d-3b39-436f-9959-828d2667793f/8132c88d-3b39-436f-9959-828d2667793f.pdf?AWSAccessKeyId=ASIAV7XHNU2AZU7RBWV7&Signature=ZJRgXy6115%2BxM%2BX4mKSL6FPQrzM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEE0aCXVzLWVhc3QtMSJHMEUCIQCeUTrR9IOr8jt6JZhQLyiNHiQGtUGGz%2BVyh1WJ9huxcQIgUeHzOGUvS7%2FB1SCaKMk16buD%2Fkavc%2FervN%2BM%2Fn4hGNgqqAMIlv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAEGgw0MTE3Mjg0NTUyOTciDI9tYssJsORHb3Axqyr8AqWssrJcuylKsu2uy3W2XKdllZGDtWXyD2qbOYssBukdTFtUz4PLaQtEwt59FBX2yqvYCTlqIW2f3dTlnW6Xns1HFLy0qzHhFaO2GZcjkCxnynQPkoviw1kLo2GJvP91z7DjSoPwxLuRAUPYuTsppeV%2BcJFhW779tTblGpL66P%2BVKN87aId3qmldMQgAGQjn0ZViBdt5klRK8XEyI4hFqOG3um0N04iXYmrNWQOKUIy94lfrrurP0UkWKlHppEDlw2cmtdkCJmFW5ETkHJXIctPsWJFhY1Et059WXm1dFTWkDt6%2Bfjhi9XJQH52aThh%2F%2BnCSA99nsC8EnOqmKoVRzSUCbXAc9f92umMTfY2kNkc%2FSe9jV1wOrQZUlD5pOL6l1Pcn0Ju9Zk%2B4dUA0aT3vK1tvRBZ7s%2FArBNxf8lNG7U4U1X0ACfFxhdf32pgcxXZPGGVFbneqzAuCT2TznT%2BR8lCb6TeDl4Ob4Lud1pLTH6UCFMHA65i8EbtlIoA6MIunjqQGOp0BzOgf8r0tYh29jz2ZuuTnxn9G1JD4lCCxYSdGYx5rsxebEUpQXuT%2FRjSu0ZCes20GY2Ucuia67mjLvg1sKF5N4A6X9kVUZt9jkkRoeUL5%2BH0jDq%2BgXlG7POxYAg25mJ4O2ODe3JiSOhxPiAS8XH%2Bnv6GcH6SbRZkFg3pBoI%2FcIz%2FCADNsgyiwxt0%2BNGzsj29u%2BlVpgrLa8jDCNAKIRw%3D%3D&Expires=1686348188",
      {
        method: "PUT",

        body: new Blob([file]),
      }
    ).then((response) => {
      console.log("Archivo subido con éxito:");
    });
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    uploadFile(file);
  };

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
        <input type="file" onChange={handleFileUpload} />
      </div>
    </>
  );
}
