import users from "~/services/users";
import type { Route } from "./+types/home";
import { Link, redirect, replace } from "react-router";


export async function clientLoader() {
  return replace("/app");
}

export default function Home() {
  return (
    <div>
      <Link to="/test" viewTransition>Go to Test</Link>
    </div>
  );
}
