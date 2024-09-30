import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
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

const AttachFileBtn = styled.label`
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
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all .3s ease-in-out;
    &:hover,
    &:active{
        opacity: .85;
    }
`;


export default function PostTweetForm(){
    const [isLoading, setLoading] = useState(false)
    const [tweet , settweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onchange= (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        settweet(e.target.value);
    }
    const onfilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1){
            if(files[0].size < 1*1024*1024){
                setFile(files[0]);
            }else{
                alert("I think you uploaded oversized file. (Max: 1MB)")
            }
        }
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser
        if(!user || isLoading || tweet === "" || tweet.length > 180){
            return;
        }

        try {
            setLoading(true);
            const doc = await addDoc(collection(db, "tweets"), {
              tweet,
              createdAt: Date.now(),
              username: user.displayName || "Anonymous",
              userId: user.uid,
            });
            if(file){
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file)
                const url = await getDownloadURL(result.ref);
                updateDoc(doc, {
                    photo : url,
                })
            }
            settweet("")
            setFile(null)
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
    }

    return(
        <Form onSubmit={onSubmit}>
            <TextArea required rows={5} maxLength={180} onChange={onchange} value={tweet} placeholder="What is Happening???"/>
            <AttachFileBtn htmlFor="file">{file ? "Photo Added!" : "Add Photo"}</AttachFileBtn>
            <AttachFileInput onChange={onfilechange} type="file" id="file" accept="image/*"/>
            <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"}/>
        </Form>
    )
}