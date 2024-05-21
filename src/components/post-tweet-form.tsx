import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; //! 추가

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 20px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;
// textarea는 크기 조절이 가능하도록 되어있음 -> 방지: width: 100%; resize: none;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1da1f2;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1da1f2;
  font-size: 14px;
  font-weight: 600;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1da1f2;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 15px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // typescript 구문: 파일이 존재하거나, null일 때
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 여러개의 파일이 업로드 되는 경우가 존재 -> 방지 위해 첫번째 1개만 받아옴
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || tweet === "" || tweet.length > 140 || isLoading) {
      return;
    }
    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        //! 추가
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        //! 추가
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url }); //! 사진 파일을 링크와 함께 기존 트윗에 업데이트
      }
      setTweet(""); //! 초기화 해주기
      setFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // 파일이 업로드 되었으면 -> "Photo Added", 아니면 -> "Add Photo"
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required //! 추가
        rows={5}
        maxLength={140}
        value={tweet}
        onChange={onChange}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
  // htmlFor은 input과 label을 연결해주는 역할을 한다. -> HTML의 "for=" 역할
}
