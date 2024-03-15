import showdown from "showdown";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import Posts from "./Posts";
import Navbar from "./Navbar";
import { useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
//import { useAuthContext } from '../hooks/useAuthContext';
import { useCookies } from "react-cookie";

const CreateAnswer = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  // const { user }=useAuthContext()
  const [body, setBody] = useState("**Hello world!!!**");
  const navigate = useNavigate();
  const post=props.post
  // console.log(user)
  //const Ownername=user;


  const handleSubmit = (e) => {
    e.preventDefault();
    let converter = new showdown.Converter();
    let html = converter.makeHtml(body);
    console.log(cookies.token)
    axios
      .post("http://localhost:5000/create_answer",{
        body: html,
        postid:post.id
      }, {
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${cookies.token}`,
        }})      
        .then((res) => {
        if (res.data.tokenStatus == 1) {
          alert("Answer posted succesful")
         setTimeout(() => {
          window.location.reload();
         }, 2000);
        }
        else
        {
          alert("You have to login to post an answer.Redirecting...");
          setTimeout(() => {
            navigate("/login");
           }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div>
        <div className="flex flex-col bg-white mx-10 my-5 rounded-md mt-2">
          <p className="text-2xl text-center">Your Answer</p>
          <form className="mt-6 mx-5" onSubmit={handleSubmit}>
            <label >Answer Body</label>
            <MDEditor className="my-6" value={body} onChange={setBody} />
                        
            
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
              Post Your Answer
            </button>
          </form>
        </div>
      </div>
  );
};

export default CreateAnswer;
