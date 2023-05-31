import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();


  
  return (
    <>
      <div className="home-container">
        <h1> This is a Landing page</h1>{" "}
        <button  onClick={() => router.push("login")}>
          Login
        </button>
      </div>
    </>
  );
}
