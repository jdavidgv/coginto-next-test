import "@/styles/globals.css";
import { Amplify } from "aws-amplify";
import { useRouter } from "next/router";

const COGNITO_DEV = {
  REGION: "us-east-1",
  USER_POOL_ID: "us-east-1_CiremdzUH",
  APP_CLIENT_ID: "4gdf54267ij2t9d9g38mk6eo7r",
  DOMAIN: "notery-auth-domain-dev.auth.us-east-1.amazoncognito.com",
};
const COGNITO_STAGING = {
  REGION: "us-east-1",
  USER_POOL_ID: "us-east-1_JsAPmk5Gi",
  APP_CLIENT_ID: "5h0o1uehb8andqhgfo5s8k4r9i",
  DOMAIN: "notery-auth-domain-staging.auth.us-east-1.amazoncognito.com",
};
const COGNITO = COGNITO_STAGING
Amplify.configure({
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,

  oauth: {
    domain: COGNITO.DOMAIN,
    scope: ["email", "openid"],
    redirectSignIn: "http://localhost:3000/home",
    redirectSignOut: "http://localhost:3000/login",
    clientId: COGNITO.APP_CLIENT_ID,
    responseType: "code",
  },
});
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
