import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  //로그인된 유저이면 유저 정보를 전달, 아니면 null

  if (user === null) { //유저로그인 되어있지 않으면 로그인페이지로 이동
    return <Navigate to="/login"/>
  }
  return children;
}
