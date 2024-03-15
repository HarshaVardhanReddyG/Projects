import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import DisplayPosts from "./DisplayPosts";
import { useCookies } from "react-cookie";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Home2 = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [postsReady, setPostsReady] = useState(0);
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState(1);
  const [PostsPresent, setPostsPresent] = useState(1);
  const handleSearch = (e) => {
    e.preventDefault();
    setPostsReady(0);
    axios
      .post(
        "http://localhost:5000/home2",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(async (res) => {
        setPosts(res.data.posts);
        if (res.data.totpage !== 0) {
          setPostsPresent(1);
          setPages(res.data.totpage);
        }
        else{
          setPostsPresent(0);
        }
        setPostsReady(1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="relative flex flex-col min-h-screen from-red-500 to-yellow-500 bg-gradient-115 overflow-hidden">
        <main className="px-12 mb-2">
          <section id="about" className="py-12">
            <div className="flex flex-col fbg-gray-900 text-white px-3 py-8 rounded-t text-sm font-mediumlex-col bg-white items-center justify-center w-full">
              <h2 className="text-3xl text-center font-semibold text-black">
                Welcome
              </h2>
              <hr className="my-4 w-1/2" />
              <div className="flex flex-row bg-white text-center justify-between w-1/2">
                <button className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 duration-300 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  <a href="http://localhost:3000/create_post">Create Post</a>
                </button>
                <button
                  className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110  duration-300 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  onClick={(e) => handleSearch(e)}
                >
                  See posts
                </button>
              </div>
            </div>
            <div className="flex flex-col rounded-b bg-white  justify-center w-full">
              <div className="mx-10">
                <hr className="my-4 w-full" />
                <h1 className="text-8x1 text-center font-bold ">
                  Instructions
                </h1>
                <ol className="list-decimal">
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Create Post</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          To create a post, click the "Create Post" button
                          located above or in the Navbar. This will take you to
                          a page where you can create your post using the
                          Markdown Editor. For a post, title, body, and tags
                          (which must be selected from existing ones) are
                          mandatory. Your post will be visible to everyone.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Edit Post</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          To edit a post, click the "Edit" button located in the
                          page of your post and you will be taken to a page
                          where you can edit your post using Markdown Editor.
                          Edit button will be visible only to the post owner.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Delete Post</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          To delete a post, click the "Delete" button located in
                          the page of your post and the entire post will be
                          deleted. Delete button will be visible only to the
                          post owner.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Post Answer</Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          On the Post page, you can find the answers to the
                          question. To add your answer, use the Markdown editor
                          located just before the other answers. Write your
                          answer and then post it. Your answer will be visible
                          to everyone.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Upvote</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          There is an upvote button present for each answer and
                          post. To upvote, press the upward arrow button located
                          on the left side of each post/answer.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                  <li className="my-4">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Downvote</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          There is an downvote button present for each answer
                          and post. To downvote, press the downward arrow button
                          located on the left side of each post/answer.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </main>
        {!!postsReady && PostsPresent == 1 && (
          <div className="flex flex-col bg-white items-center justify-center rounded-lg mx-12 mb-4">
            <DisplayPosts
              posts={posts}
              pages={pages}
              params={{
                searchOption: "home2",
                Edit_status: 1,
              }}
            />
          </div>
        )}
        {!PostsPresent && (
          <div className="flex flex-col mx-12 mb-8 rounded-lg bg-white items-center justify-center">
            <div className="flex items-center">
              <div className="w-12 h-12 mt-2 flex items-center justify-center bg-gray-300 rounded-md mr-2">
                <svg
                  fill="#000000"
                  width="32px"
                  height="32px"
                  viewBox="-2.5 -2.5 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin"
                  class="jam jam-search"
                >
                  <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-semibold mt-4">No results found</div>
            <div className="text-xl text-gray-400">
              You don't have any posts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home2;
