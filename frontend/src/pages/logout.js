import { redirect } from "react-router-dom";

export async function logOutAction() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");

  return redirect("/");
}
