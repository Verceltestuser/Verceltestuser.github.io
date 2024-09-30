import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ITweet } from "./timeline";
/* export interface EditITweet {
  id: string;
  photo?: string;
  tweet: string;
  setIsEditing: () => boolean;
} */
const Form = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid #fff;
    padding: 20px;
    border-radius: 20px;
    font-size: 1rem;
    color: #fff;
    background-color: transparent;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    transition: border .3s ease-in-out;
    &::placeholder{
        font-size: 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus{
        outline: none;
        border-color: #1d9bf0;
        box-shadow: 3px #1d9bf0;
    }
`;
const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #1d9bf0;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
export default function EditTweetForm({ photo, tweet, id, setIsEditing }:ITweet) {
  const [isLoading, setIsLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [editFile, setEditFile] = useState<File | null>(null);
  // console.log(id, tweet, photo);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1*1024*1024) {
        alert("I think you uploaded oversized file. (Max: 1MB)")
        return;
      }
      // console.log(files);
      setEditFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === "" || editTweet.length > 180)
      return;
    try {
      setIsLoading(true);
      const tweetRef = doc(db, "tweets", id);
      await updateDoc(tweetRef, {
        tweet: editTweet,
      });
      if (editFile) {
        if (photo) {
          const originRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(originRef);
        }
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);
        // console.log(url);
        await updateDoc(tweetRef, {
          photo: url,
        });
      }
      setEditTweet("");
      setEditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
      />
      <AttachFileButton htmlFor={`editFile${id}`}>
        {editFile ? "Photo added/changed !" : photo ? "Change photo" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onEditFileChange}
        id={`editFile${id}`}
        type="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Editing..." : "Edit Tweet"}
      />
    </Form>
  );
}