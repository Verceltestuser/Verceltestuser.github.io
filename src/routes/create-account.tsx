import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components"
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import GithubButton from "../components/github-btn";


const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  padding: 2rem 1rem;
  margin: 0 auto;/* Black background */
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #fff; /* White text for contrast */
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Form = styled.form`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.9rem 1.2rem;
  border: 1px solid #333; /* Darker border to match background */
  border-radius: 25px;
  width: calc(100% - 400px);
  font-size: 1rem;
  background-color: #1c1c1e; /* Subtle dark gray background for inputs */
  color: #fff; /* White text inside inputs */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #8e8e93; /* Lighter placeholder for readability */
  }

  &:focus {
    outline: none;
    border-color: #007aff; /* Apple's blue */
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.2);
  }

  &[type="submit"] {
    background-color: #007aff;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #005bb5;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: #ff3b30; /* Apple's red for errors */
  margin-top: 1rem;
  text-align: center;
  padding: 0.5rem 1rem;
`;



const Switcher = styled.span`
    margin-top: 20px;
    a{
        color: #007aff;
    }
`;


const Translation = styled.p`
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  font-weight: 600;
  gap: 10px;
  margin-bottom: 10px;
  &#last{
    margin-bottom: 30px;
  }
`;




export default function CreateAccount(){
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {name, value}} = e;
        if(name === "name"){
            setName(value)
        }else if (name == "email"){
            setEmail(value)
        }else if (name == "password"){
            setPassword(value)
        }
    } 
    const onsubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")
        if (name === "" || email ==="" || password === "" || isLoading){
            return;
        }
        try{
            setLoading(true)
            //계정 만들기
            const credentials = await createUserWithEmailAndPassword(auth, email, password)
            //유저 이름 설정
            await updateProfile(credentials.user,{
                displayName : name
            });
            //홈페이지로 납치
            navigate("/")
        }catch(e){
            if (e instanceof FirebaseError) {
                setError("You did something wrong....");
            }
        }finally{
            setLoading(false)
        }
    }
    return (
        <Wrapper>
            <Title>Welcome To Densha Insight</Title>
            <Translation>電車インサイトへようこそ！</Translation>
            <Translation id="last">Densha Insight에 오신것을 환영합니다!</Translation>
            <Form onSubmit={onsubmit}>
                <Input onChange={onChange}  name="name" value={name} placeholder="Name" type="text" required/>
                <Input onChange={onChange}  name="email" value={email} placeholder="Email" type="email" required/>
                <Input onChange={onChange}   name="password" value={password} placeholder="Password" type="password" required/>
                <Input type="submit" value={isLoading ? "Loading..." : "Sign Up"}/>
            </Form>
            {error !== "" ? <Error>error</Error> : null}
            <Switcher>
                Already have an account? <Link to="/login">Log In</Link>
            </Switcher>
        </Wrapper>
    )
}