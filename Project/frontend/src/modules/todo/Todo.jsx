import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./Todo.css";

export default function Todo() {
  // CENTRAL TASK STATE - shared between TaskSection and ReviewSection
  const [tasks, setTasks] = useState([]);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>To Do</h2>
      </div>

      {/* MAIN CONTENT - Outlet will render the nested routes */}
      <div className="todo-content">
        <Outlet context={{ tasks, setTasks }} />
      </div>
    </div>
  );
}
