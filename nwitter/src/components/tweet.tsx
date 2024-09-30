import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";


const Wrapper = styled.div`
      display: grid;
      grid-template-columns: 3fr 1fr;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 15px;
`;

const Column = styled.div`
`;

const Photo = styled.img`
     width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
      font-weight: 600;
      font-size: 15px;
`;

const Payload = styled.p`
      margin: 10px 0px;
      font-size: 18px;
`;


const DeleteBtn = styled.button`
  margin-top: 10px;
  background-color: #ed4848;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  transition: all .5s ease-in-out;
  &:hover{
    opacity: .85;
  }
`;

const EditButton = styled.button`
  margin-top: 10px;
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  transition: all .5s ease-in-out;
  &:hover{
    opacity: .85;
  }
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;



export default function Tweet({username, photo, tweet, userId, id}:ITweet){
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const onDelete = async () => {
      const ok = confirm('Are you sure that you want to delete this tweet?')
      if(ok){
        const ok2 = confirm("Note that deleted data cannot be recovered by ANYONE")
        if(ok2){
          if (user?.uid !== userId) return;
          try {
            await deleteDoc(doc(db, "tweets", id));
            if(photo){
              const photoref = ref(storage, `tweets/${user.uid}/${id}`)
              await deleteObject(photoref)
            }
          } catch (error) {
            console.log(error)
          }finally{
    
          }
        }else{
          return
        }
      }else{
        return;
      }

    }
    const onEdit = () => setIsEditing((prev) => !prev);
    return(
     <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            photo={photo}
            id={id}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
       { user ?. uid === userId ?(      
          <BtnWrap>
            <DeleteBtn onClick={onDelete}>Delete</DeleteBtn>
            <EditButton onClick={onEdit}>
              {isEditing ? "Cancel" : "Edit"}
            </EditButton>
          </BtnWrap>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
    )
}