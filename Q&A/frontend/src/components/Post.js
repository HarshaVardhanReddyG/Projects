import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateAnswer from "./createAnswer";
import { useCookies } from "react-cookie";
function Post() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const location = useLocation();
  const post = location.state.post;
  const EDS = location.state.Edit_status;

  const date1 = new Date(post.creation_date);
  const date2 = new Date(post.last_modified);
  const [answers, setanswers] = useState([]);
  const [ansready, setansready] = useState(false);

  const [totpagenum, settotpagenum] = useState(1);
  const [curpagenum, setCurpagenum] = useState(1);
  const [upvotes, setupvotes] = useState(post.up_votes);
  const [downvotes, setdownvotes] = useState(post.down_votes);
  const navigate = useNavigate();
  const [status,setStatus] = useState(0);


useEffect(()=>
{
  
  if (answers.length > 0) setansready(true);
    axios
      .get("http://localhost:5000/posts/" + post.id, {})
      .then((res) => {
        settotpagenum(res.data.totpage);
        console.log(res.data);
        setupvotes(res.data.votes[0].up_votes);
        setdownvotes(res.data.votes[0].down_votes);
      })
      .catch((err) => {
        console.log(err);
      });
    handleFirstPage();
  
  
  axios.post("http://localhost:5000/status",{
    id:post.id
  },{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.token}`,
    }
  })
  .then((res)=>
  {
    if(res.data.tokenStatus == 1)
    {

         setStatus(res.data.status)
    }
    else
    {

    }
  })
  .catch((err)=>
  {
    console.log(err);
  })
},[]);

  function handleBack() {
    if (curpagenum != 1) {
      axios
        .get(
          "http://localhost:5000/posts/" + post.id + "/" + (curpagenum - 1),
          {}
        )
        .then((res) => {
          setanswers(res.data.answers);
          setCurpagenum(curpagenum - 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleNext() {
    if (curpagenum != totpagenum) {
      axios
        .get(
          "http://localhost:5000/posts/" + post.id + "/" + (curpagenum + 1),
          {}
        )
        .then((res) => {
          setanswers(res.data.answers);
          setCurpagenum(curpagenum + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handle_answers = (e) => {
    e.preventDefault();
    setansready(false);
    axios
      .get("http://localhost:5000/posts/" + post.id + "/" + curpagenum, {})
      .then((res) => {
        setanswers(res.data.answers);
        setansready(true);
        console.log(res.data.totpage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleFirstPage() {
    setansready(false);
    axios
      .get("http://localhost:5000/posts/" + post.id + "/" + curpagenum, {})
      .then((res) => {
        setanswers(res.data.answers);
        setansready(true);
        console.log(res.data.totpage);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpvote(e) {
    let id = e.target.id;
    let type = 1
    if(status == 1) { setStatus(0); setupvotes(upvotes - 1)}
    if(status == 0) { setStatus(1); setupvotes(upvotes + 1)}
    if(status == -1) { setStatus(1); setupvotes(upvotes + 1); setdownvotes(downvotes - 1)}
    if (id != null) {
      //change the css of this button

      axios
        .post("http://localhost:5000/upvote/" + id,{
          type: type,
          status:status,
          button:1
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          }
         
        })
        .then((res) => {
          if (res.data.tokenStatus != 1) {
            alert(
              "You have to login to upvote/downvote an answer.Redirecting..."
            );
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to update due to internal error. Reloading");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    }
  }

  function handleDownvote(e) {
    //change css of the button

    let id = e.target.id;
    let type = 1
    if(status == -1) {setStatus(0); setdownvotes(downvotes - 1 )}
    if(status == 0) {setStatus(-1); setdownvotes(downvotes + 1)}
    if(status == 1) {setStatus(-1); setdownvotes(downvotes + 1); setupvotes(upvotes-1)}

    if (id != null) {
      axios
        .post("http://localhost:5000/upvote/" + id,{
          type: type,
          status:status,
          button:0
        } ,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          }
        })
        .then((res) => {
          if (res.data.tokenStatus != 1) {
            alert("You have to login to upvote/downvote an answer");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
          else
          {

          }
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to update due to internal error. Reloading");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    }
  }

  const handleDelete = (e, post_id) => {
    e.preventDefault();
    if (window.confirm("Are u sure u want to delete this post?")) {
      axios
        .post(
          "http://localhost:5000/delete_post/" + post_id,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.tokenStatus == 1) {
            alert("Question deleted succesful.Redirecting..");
            setTimeout(() => {
              navigate("/home2");
            }, 2000);
          } else {
            alert("Experienced internal error. Try againn..");
            // setTimeout(() => {
            //     navigate("/login");
            // }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("go back");
    }
  };

  function List({ items }) {
    return (
      <div className="flex flex-col">
        <h1 className="text-center text-2xl mt-8">Answers</h1>
        {items.map((item, index) => {
          return (
            <div className="flex flex-row border border-black mx-2 my-2">
              <div className="flex flex-col">
                <button className="hover:bg-blue-600" onClick={handleUpvote}>
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    id={item.id}
                    post_type="0"
                  >
                    <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
                  </svg>
                </button>
                <h3 className="text-center mb-4">{item.up_votes}</h3>
                <button className="hover:bg-blue-600" onClick={handleDownvote}>
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    id={item.id}
                    post_type="0"
                  >
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" />
                  </svg>
                </button>
                <h3 className="text-center">{item.down_votes}</h3>
              </div>
              <div className="flex flex-col justify-between border border-black bg-slate-200 my-2 mx-2">
                <p
                  key={index}
                  className="bg-slate-200 [&>li]:prefg hover:bg-sky-500 rounded px-4 py-2 "
                >
                  {parse(item.body)}
                </p>
                <div className="flex justify-between">
                  <div className="mx-8 mb-2">
                    answered: {date_time(item.creation_date)}
                  </div>
                  {item.last_edited != null && (
                    <div className="mx-8 mb-2">
                      last edited: {date_time(item.last_edited)}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="mx-8 mb-2 text-center">
                    answered by: {item.ownername}
                  </div>
                </div>
                <p>&nbsp;&nbsp;</p>
                <br></br>
              </div>
            </div>
          );
        })}
      </div>
    );
  }


  function difference(date) {
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    return years + " years, " + months + " months" + " Ago";
  }

  function date_time(datetime) {
    const timestamp = datetime;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    return formattedDate + " at " + formattedTime;
  }

  function ListTags({ items }) {
    var arr = items.tags.split(/[<\s>]+/);
    arr = arr.filter(function (el) {
      return el != "";
    });

    return (
      <div className="flex flex-row mx-8">
        Tags: <p>&nbsp;&nbsp;</p>
        {arr.map((tag, index) => {
          return (
            <div className="flex justify-between">
              <button
                key={index}
                className="bg-slate-200 hover:bg-sky-500 rounded px-4 pt-1 pb-1 truncate"
              >
                {tag}
              </button>
              <p>&nbsp;&nbsp;</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="relative flex flex-col justify-center min-h-screen from-red-500 to-blue-500 bg-gradient-115 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div className="flex flex-row border border-black mx-2 my-2">
              <div className="flex flex-col mt-8">
                <button className={status === 1 ? "bg-blue-500" : "hover:bg-blue-600"} onClick={handleUpvote}>
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    id={post.id}
                  >
                    <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
                  </svg>
                </button>
                
                
              {console.log("upvotes:",upvotes)}
                <h3 className="text-center mb-4">{upvotes}</h3>
                <button className={status === -1 ? "bg-blue-500" : "hover:bg-blue-600"} onClick={handleDownvote}>
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    id={post.id}
                    post_type={1}
                  >
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" />
                  </svg>
                </button>
                <h3 className="text-center">{downvotes}</h3>
              </div>
              <div className="flex flex-col justify-between my-2 mx-2">
                <div className="flex flex-row justify center">
                  <div className="text-center text-3xl mt-2 mb-2 mx-10">
                    {post.title}
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="mx-8 mb-2">Asked:{difference(date1)}</div>
                  {post.last_modified != null && (
                    <div className="mx-8 mb-2">
                      Modified:{difference(date2)}
                    </div>
                  )}
                </div>
                <div className="text-left mx-8 border-2 border-black">
                  <div className="mx-4 my-4 [&>pre]:prefg ">
                    {parse(post.body)}
                  </div>
                </div>
                <div className="flex flex-row mx-8 mb-2 mt-4 text-center">
                  Posted by: {post.ownername}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center w-full">
              <div className="mt-4">
                {EDS == 1 && (
                  <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 mb-4 border border-blue-700 rounded">
                    <Link
                      to={"/posts/" + post.id + "/edit_post/"}
                      state={{ post: post }}
                    >
                      Edit
                    </Link>
                  </a>
                )}
                {EDS == 1 && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold w-18 h-9 py-1 px-2 mt-2 mb-4 ml-16 border border-blue-700 rounded"
                    onClick={(e) => handleDelete(e, post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            {<ListTags items={post}></ListTags>}
            <CreateAnswer post={post}></CreateAnswer>
            {!!ansready && <List items={answers}></List>}
          </div>
          <div className="flex justify-between w-full">
            {" "}
            <button
              className="border w-24 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              onClick={handleBack}
            >
              back
            </button>{" "}
            Page {curpagenum} of {totpagenum}{" "}
            <button
              className="border w-24 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              onClick={handleNext}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
