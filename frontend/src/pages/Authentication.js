import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  const form = await request.formData();
  const data = Object.fromEntries(form);

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "unsupported mode." }, { status: 422 });
  }

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 422 || response.status === 400) {
    return response;
  }

  if (!response.ok) {
    throw json(
      { message: "could not authenticate user" },
      {
        status: 500,
      }
    );
  }

  const resData = await response.json();

  localStorage.setItem("token", resData.token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
}
