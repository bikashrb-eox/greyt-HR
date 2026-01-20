import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Todo.css";

export default function ReviewSection() {
  // Get shared tasks state from Todo parent via Outlet context
  const { tasks } = useOutletContext();

  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const types = [
    "All",
    "Attendance",
    "Custom Workflow",
    "EMPINFO",
    "LEAVE",
    "LETTER",
  ];

  // FILTER BY TYPE
  const filteredByType =
    selectedType === "All"
      ? tasks
      : tasks.filter((t) => t.todoType === selectedType);

  // FILTER BY TAB STATUS
  const filteredByStatus = filteredByType.filter((task) =>
    activeTab === "active"
      ? task.status === "Pending"
      : task.status === "Completed"
  );

  // SEARCH BY EMPLOYEE / ASSIGNEE
  const finalList = filteredByStatus.filter((task) =>
    task.assignee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="review-container">

      <div className="review-header">
        <h2>
          <i className="material-icons">rate_review</i> Review Tasks
        </h2>
      </div>

      <div className="review-filters">

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="type-select"
        >
          {types.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <div className="search-box">
          <i className="material-icons">search</i>
          <input
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className="tab-section">
        <button
          className={activeTab === "active" ? "tab active" : "tab"}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>

        <button
          className={activeTab === "closed" ? "tab closed" : "tab"}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </button>
      </div>

      <div className="review-list">

        {finalList.length === 0 ? (
          <div className="no-data">
            <i className="material-icons">info</i>
            No tasks found
          </div>
        ) : (
          finalList.map((task) => (
            <div key={task.id} className="review-card">

              <div className="review-left">
                <h4>{task.name}</h4>

                <p>
                  <i className="material-icons small">person</i>
                  {task.assignee}
                </p>

                <p>
                  <i className="material-icons small">category</i>
                  {task.todoType}
                </p>

                <p>
                  <i className="material-icons small">event</i>
                  {task.dueDate}
                </p>
              </div>

              <div className="review-right">
                <span
                  className={
                    task.status === "Pending"
                      ? "badge pending"
                      : "badge complete"
                  }
                >
                  {task.status}
                </span>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}
