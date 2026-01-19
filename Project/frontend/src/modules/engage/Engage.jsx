import React, { useState } from "react";
import "./Engage.css";

export default function Engage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All Groups");
  const [location, setLocation] = useState("All Locations");
  const [department, setDepartment] = useState("All Departments");
  const [like, setLike] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Rahul Sharma",
      text: "Great job team on completing the Q1 targets!",
      type: "Appreciations",
      location: "Bangalore",
      department: "IT Support",
      time: "2 hrs ago",
      likes: 0,
      comments: [],
      image: "https://c8.alamy.com/comp/2R8KM1F/happy-people-dancing-at-party-flat-vector-illustration-2R8KM1F.jpg",
    },
    {
      id: 2,
      user: "HR Team",
      text: "Holiday announced on 26th Jan for Republic Day.",
      type: "Announcements",
      location: "Chennai",
      department: "Human Resources",
      time: "1 day ago",
      likes: 0,
      comments: [],
      image: "https://static.vecteezy.com/system/resources/previews/011/214/152/original/the-girl-is-celebrating-with-fireworks-vector.jpg",
    },
    {
      id: 3,
      user: "Management",
      text: "Company Townhall scheduled for next Friday.",
      type: "Company News",
      location: "USA",
      department: "Management",
      time: "3 days ago",
      likes: 0,
      comments: [],
      image: "https://img.freepik.com/premium-vector/doodle-drawing-cheering-crowd_961875-494757.jpg?w=2000",
    },
  ]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  text: commentText,
                  time: new Date().toLocaleTimeString(),
                },
              ],
            }
          : post,
      ),
    );

    setCommentText("");
  };

  const handleShare = (post) => {
    const text = encodeURIComponent(post.text);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="engage-container">
      <div className="engage-header">
        <h2>Engage</h2>
      </div>

      {/* FILTER BAR */}
      <div className="engage-filters">
        <div className="search-box">
          <i className="material-icons">search</i>
          <input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option>All Groups</option>
          <option>Announcements</option>
          <option>Appreciations</option>
          <option>Company News</option>
          <option>Events</option>
          <option>Everyone</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option>All Locations</option>
          <option>Bangalore</option>
          <option>USA</option>
          <option>Chennai</option>
          <option>Cochin</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option>All Departments</option>
          <option>Account Management</option>
          <option>Administration</option>
          <option>Architecture</option>
          <option>Automation</option>
          <option>DevOps</option>
          <option>Human Resources</option>
          <option>IT Support</option>
          <option>Management</option>
          <option>Production Support</option>
          <option>Quality Control</option>
        </select>
      </div>

      {/* MAIN CONTENT */}
      <div className="engage-content">
        <div className="post-feed">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="avatar">
                  <i className="material-icons">person</i>
                </div>

                <div>
                  <h4>{post.user}</h4>
                  <p>{post.time}</p>
                </div>
              </div>

              <div className="post-body">
                <div
                  className="post-image"
                  style={{
                    backgroundImage: `url(${post.image})`,
                  }}
                ></div>

                <p>{post.text}</p>
              </div>

              <div className="post-footer">
                <button onClick={() => handleLike(post.id)}>
                  <i className="material-icons">thumb_up</i>
                  <span className="like-count">{post.likes}</span>
                </button>

                <button>
                  <i className="material-icons">chat_bubble</i>
                  <span className="like-count">{post.comments.length}</span>
                </button>

                <button onClick={() => handleShare(post)}>
                  <i className="material-icons">share</i>
                </button>
              </div>

              <div className="comment-box">
                <input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button onClick={() => handleComment(post.id)}>Post</button>
              </div>

              <div className="comments-list">
                {post.comments.slice(-2).map((c, index) => (
                  <div key={index} className="single-comment">
                    <i className="material-icons">person</i>
                    <div>
                      <p>{c.text}</p>
                      <small>{c.time}</small>
                    </div>
                  </div>
                ))}
              </div>

              {post.comments.length > 2 && (
                <button
                  className="view-more"
                  onClick={() => {
                    setActivePost(post);
                    setShowPopup(true);
                  }}
                >
                  View More Comments
                </button>
              )}
            </div>
          ))}

          {showPopup && activePost && (
            <div className="comment-popup">
              <div className="popup-content">
                <h3>All Comments</h3>

                {activePost.comments.map((c, index) => (
                  <div key={index} className="single-comment">
                    <i className="material-icons">person</i>
                    <div>
                      <p>{c.text}</p>
                      <small>{c.time}</small>
                    </div>
                  </div>
                ))}

                <button
                  className="close-btn"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="engage-right">
          <h3>Activities</h3>

          <div className="activity-box">
            <p>All Activities</p>
            <p>Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
