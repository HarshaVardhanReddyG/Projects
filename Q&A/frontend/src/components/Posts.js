import { useEffect, useState } from "react";
import DisplayPosts from "./DisplayPosts";
import Navbar from './Navbar';
import axios from "axios";
function Posts(props) {
  const [searchValue, setSearchValue] = useState("");
  const [searchOption, setSearchOption] = useState("tag");
  const [autocomp, setautocomp] = useState(0);
  const [postsReady, setPostsReady] = useState(0);
  const [tagload, settagload] = useState(0);
  const [tagarray, settagarray] = useState([]);
  const [matches, setmatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState(0);
  const [yvalue, setyvalue] = useState(28);
  const [multytag, setMultytag] = useState([]);
  const [filter,setFilter] = useState('latest');
  const [searched,setsearch] = useState(0);
  
  function handleClick(e) {
    if (searchOption == "multiple_tags") {
      if (multytag.length == 5) {
        alert("A post cannot have more than five tags.");
      } else {
        let arr = multytag;
        if (!arr.includes(e.target.value)) {
          arr.push(e.target.value);
          let search_bar = document.getElementById("search-bar");
          search_bar.value = "";
          setSearchValue("");
          setMultytag([...arr]);
        } else {
          alert("This tag is already selected!");
        }
      }
    } else {
      let search_bar = document.getElementById("search-bar");
      search_bar.value = e.target.value;
      setSearchValue(e.target.value);
    }
  }

  //this function is for handling clicks on tags after posts have been displayed
  function handleTagClick(e) {
    e.target.value = e.target.innerHTML;
    handleClick(e);
    let search_button = document.getElementById("search-button");
    setTimeout(() => {
      search_button.click();
    }, 100);
  }
  //this function is for removing tags in multi tag display
  function removeTag(e) {
    e.preventDefault();

    let ind = e.target.getAttribute("ind");

    let arr = multytag;
    arr.splice(ind, 1);

    setMultytag([...arr]);
  }

  //
  function autocompleter() {
    setautocomp(0);
    if (searchValue == "") {
      return;
    }
    if (
      !tagload &&
      (searchOption == "tag" || searchOption == "multiple_tags")
    ) {
      axios
        .get("http://localhost:5000/tags", {})
        .then((res) => {
          settagload(1);
          settagarray(res.data.tags);
          let temp = tagarray.filter((tag) => {
            const regex = new RegExp(`${searchValue}`, "gi");
            return tag.tag_name.match(regex);
          });
          setmatches(temp);
          setautocomp(1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (
      tagload &&
      (searchOption == "tag" || searchOption == "multiple_tags")
    ) {
      let temp = tagarray.filter((tag) => {
        const regex = new RegExp(`${searchValue}`, "gi");
        return tag.tag_name.match(regex);
      });
      setmatches(temp);
      setautocomp(1);
    } else if (searchOption == "username" && searchValue.length > 0) {
      axios
        .post("http://localhost:5000/users", {
          userName: searchValue,
        })
        .then((res) => {
          setmatches(res.data.users);

          setautocomp(1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }

  useEffect(() => {
    setyvalue(80);
    autocompleter();
    if (searchValue == "") {
      setyvalue(32);
    }
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    setsearch(1);
    setPostsReady(0);
    setautocomp(0);
    setyvalue(28);
    if (searchOption == "tag") {
      axios
        .post("http://localhost:5000/posts/tag/" + searchValue, { filter:filter})
        .then(async (res) => {
          setPosts(res.data.posts);
          setPages(res.data.totpage);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (searchOption == "username") {
      console.log(matches[0].id);
      if (matches.length == 1) {
        axios
          .post("http://localhost:5000/posts/user/" + matches[0].id, {filter:filter})
          .then(async (res) => {
            setPosts(res.data.posts);
            setPages(res.data.totpage);
            
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } //multiple tag
    else {
      axios
        .post("http://localhost:5000/posts/multiple_tags", { tags: multytag,filter:filter })
        .then(async (res) => {
          setPosts(res.data.posts);
          setPages(res.data.totpage);
        
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  };

  useEffect(() => {
    if (posts.length > 0){ setPostsReady(1);}
  //  if (posts.length == 0) alert("No results for this!");
    console.log(posts, " ", pages);
  }, [posts]);

  return (
    <div><Navbar/>
    <div className="relative flex min-h-screen  justify-center from-blue-500 to-emerald-500 bg-gradient-115 overflow-hidden">
      <div className="container mx-auto relative">
        <div className="translate-y-4">
          <div className="relative w-150 ">
            <form>
              <div className="flex justify-between overflow-hidden rounded-t-lg bg-white shadow">
                <input
                  id="search-bar"
                  className="text-base text-gray-400 flex-grow outline-none px-4 py-3"
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />

                <div class="flex flex-row items-center px-1 rounded-lg mx-auto ">
                  <select
                    className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                    onChange={(e) => setSearchOption(e.target.value)}
                  >
                    <option value="tag" selected>
                      tag
                    </option>
                    <option value="username">username</option>
                    <option value="multiple_tags">multiple tags</option>
                  </select>
                   
                  <select
                    className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="latest" selected>
                      latest
                    </option>
                    <option value="oldest">oldest</option>
                    <option value="upvotes">upvotes</option>
                  </select>

                  <button
                    id="search-button"
                    onClick={handleSearch}
                    className="transition duration-150 ease-in-out"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <span class="m-1 inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-2 py-2 hover:bg-indigo-700">
                      <svg
                        class="text-white"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M21.07 16.83L19 14.71a3.08 3.08 0 0 0-3.4-.57l-.9-.9a7 7 0 1 0-1.41 1.41l.89.89a3 3 0 0 0 .53 3.46l2.12 2.12a3 3 0 0 0 4.24 0a3 3 0 0 0 0-4.29Zm-8.48-4.24a5 5 0 1 1 0-7.08a5 5 0 0 1 0 7.08Zm7.07 7.07a1 1 0 0 1-1.42 0l-2.12-2.12a1 1 0 0 1 0-1.42a1 1 0 0 1 1.42 0l2.12 2.12a1 1 0 0 1 0 1.42Z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="mt-auto w-full overflow-hidden rounded-b-lg bg-white">
                {!!autocomp && (
                  <div>
                    <div class=" appearance-none w-full block bg-white border overflow-y-auto h-56  border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                      {matches.map((match) => (
                        <option
                          key={match.id}
                          className="hover:text-blue-500 py-2"
                          onClick={(e) => {
                            handleClick(e);
                          }}
                        >
                          {(searchOption == "tag" ||
                            searchOption == "multiple_tags") &&
                            match.tag_name}
                          {searchOption == "username" && match.username}
                        </option>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {searchOption == "multiple_tags" && (
                <div className="flex flex-row">
                  {multytag.map((tag, index) => (
                    <div
                      className="mx-4 bg-gray-400 rounded-lg mt-2"
                      key={index}
                    >
                      &nbsp;{tag}
                      <button className="text-red-500" onClick={removeTag}>
                        <span
                          class="m-1 inline-flex cursor-pointer items-center rounded-md bg-red-600 px-2 py-2 hover:bg-red-700"
                          ind={index}
                        >
                          <svg
                            width="12px"
                            height="12px"
                            viewBox="0 0 24 24"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-labelledby="removeIconTitle"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            fill="none"
                            color="#000000"
                          >
                            {" "}
                            <title id="removeIconTitle">Remove</title>{" "}
                            <path d="M17,12 L7,12" />{" "}
                            <circle cx="12" cy="12" r="10" />{" "}
                          </svg>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
        <div className={`transform translate-y-28`}>
          {!!postsReady && (
            <DisplayPosts
              posts={posts}
              pages={pages}
              params={{
                searchOption: searchOption,
                searchValue: searchValue,
                tags: multytag,
                Edit_status:0
              }}
              handleTagClick={handleTagClick}
            />
          )}
          {
            !!searched && !postsReady && (
              <div className="flex flex-col mx-12 rounded-lg bg-white items-center justify-center">
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
            No posts found for the user/tags entered
            </div>
          </div>
            )
          }
        </div>
      </div>
    </div>
    </div>
  );
}

export default Posts;
