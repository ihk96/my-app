import type { Route } from "./+types/home";
import { Link, redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  return redirect("/app");
}

export default function Home() {
  return (
    <div>
      <Link to="/test" viewTransition>Go to Test</Link>
    </div>
  );
}
