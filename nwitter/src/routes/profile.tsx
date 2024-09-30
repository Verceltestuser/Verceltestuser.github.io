import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvatarUpLoad = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
        height: 50px;
    }
`;

const AvatarImage = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
`;

const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Col = styled.div`
    display: flex;
`;

const EditBtn = styled.div`
    width: 22px;
    height: 22px;
    margin-left: 20px;
`

const NameInput = styled.input`
  background-color: transparent;
  font-size: 22px;
  text-align: center;
  color: white;
  border: 1px solid white;
  border-radius: 15px;
  transition: all .3s ease-in-out;
  width: 300px;
`;

export default function Profile() {
    const user = auth.currentUser
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>();
    const [name, setName] = useState(user?.displayName ?? "Anonymous")
    const [editMode, setEditMode] = useState(false);
    const [loading,setLoading] = useState(false)
    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1){
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result= await uploadBytes(locationRef , file);
            const avatarUrl = await getDownloadURL(result.ref);
            if(!user)return;
            setAvatar(avatarUrl)
            await updateProfile(user, {
                photoURL : avatarUrl,
            })
        }
    }
    const fetchTweets = async () => {
        const tweetQwery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const spanshot = await getDocs(tweetQwery);
         const tweets = spanshot.docs.map(doc => {
             const {tweet, createdAt, userId, username, photo} = doc.data();
             return{tweet, createdAt, userId, username, photo, id:doc.id}
         });
         setTweets(tweets)
    }
    useEffect(()=>{fetchTweets();},[])
    const onNameChangeClick = async ()=> {
        if(loading) return;
        if(!user) return;
        setEditMode((prev) => !prev);
        if(!editMode) return;
        try {
            await updateProfile(user, {
                displayName : name,
            });
        } catch (error) {
            console.log(error)
        }finally{
            await updateProfile(user, {
                displayName : name,
            });
            setEditMode(false);
        }
    }
    
    const onNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    return(
         <Wrapper>
            <AvatarUpLoad htmlFor="avatar">
                {Boolean(avatar) ? <AvatarImage src={avatar}/> : <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path clip-rule="evenodd" fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path></svg>}
            </AvatarUpLoad>
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
            <Col>
                {editMode ? (
                 <NameInput onChange = {onNameChange} type="text" placeholder="Write a new name..." /> 
                ) : (
                <Name>
                    {user?.displayName ?? "Anonymous"}
                </Name>
                )}
                
                <EditBtn onClick={onNameChangeClick}>
                    {editMode ? (
                        <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"></path>
                            </svg>
                    ) : (
                    <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path>
                    </svg>
                    )}
                </EditBtn>
            </Col>
            <Tweets>
                {tweets?.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
            </Tweets>
        </Wrapper>
    )
}