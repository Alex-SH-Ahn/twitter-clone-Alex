import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Wrapper,
  Title,
  Input,
  Switcher,
  Form,
  Error,
} from "./auth-components";
import GithubButton from "../components/github-button";

// const errors = {
//   "auth/email-already-in-use": "Email is already in use.",
//   "auth/invalid-email": "Email is invalid.",
//   "auth/weak-password": "Password is too weak.",
// };

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 에러메시지를 초기화
    if (name === "" || email === "" || password === "") return;
    console.log("working?");
    // Firebase가 비밀번호 유효성 검사도 해줌
    try {
      setLoading(true);
      // 유저가 인풋에 작성할 때 로딩이 true로 되어야함
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // Firebase에서 기본적으로 제공하는 미니 프로필에 이름을 지정
      navigate("/");
      // 회원가입이 완료하면 원래페이지로 돌아가야함 -> useNavigate 훅 사용
    } catch (e) {
      if (e instanceof FirebaseError) {
        // FirebaseError는 firebase에서 제공하는 에러
        // FirebaseError는 code와 message를 가지고 있음
        // code/message 출력
        // console.log(e.code, e.message);
        setError(e.message);
        // setError위에서 정의되어있고, 에러메시지를 밑의 html로 보여줌
      }
    } finally {
      setLoading(false);
    }
    console.log(name, email, password);
  };

  useEffect(() => {}, []);
  return (
    <Wrapper>
      <Title>Join Twitter</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?
        <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
