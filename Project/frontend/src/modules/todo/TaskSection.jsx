import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Todo.css";

export default function TaskSection() {
  // Get shared tasks state from Todo parent via Outlet context
  const { tasks, setTasks } = useOutletContext();
  //   const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [detailTask, setDetailTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    assignee: "",
    checklist: "All",
    priority: "Low",
    dueDate: "",
    tags: "",
    description: "",
    attachment: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const addTask = () => {
    if (!form.name.trim()) {
      alert("Task Name is mandatory");
      return;
    }

    setTasks([
      ...tasks,
      {
        ...form,
        id: Date.now(),
        status: "Pending",
        todoType: form.todoType || "Custom Workflow",
        fileName: form.attachment ? form.attachment.name : "",
      },
    ]);

    setForm({
      name: "",
      assignee: "",
      checklist: "All",
      priority: "Low",
      dueDate: "",
      tags: "",
      description: "",
      attachment: null,
      todoType: "Custom Workflow",
    });

    setShowModal(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      assignee: "",
      todoType: "Attendance",
      checklist: "All",
      priority: "Low",
      dueDate: "",
      tags: "",
      description: "",
      attachment: null,
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

 const toggleStatus = (id) => {
  setTasks(
    tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === "Pending" ? "Completed" : "Pending",
          }
        : task,
    ),
  );
};


  const openEdit = (task) => {
    setForm(task);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="task-section">
      {showModal && <div className="overlay"></div>}
      {detailTask && <div className="overlay"></div>}

      <div className="task-list">
        <div className="task-header">
          {/* <h3>Your Tasks</h3> */}
          <button className="add-task-btn" onClick={() => setShowModal(true)}>
            <i className="material-icons">playlist_add</i> Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="no-task">
            <h3>No Tasks Added</h3>
          </div>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="clickable-row"
                  onClick={() => setDetailTask(task)}
                >
                  <td>{task.name}</td>
                  <td>{task.assignee || "Not Assigned"}</td>
                  <td>{task.dueDate || "No Due Date"}</td>

                  <td>
                    <button
                      className={`status-btn ${
                        task.status === "Completed"
                          ? "status-complete"
                          : "status-pending"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(task.id);
                      }}
                    >
                      {task.status}
                    </button>
                  </td>

                  <td className="action-btns">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(task);
                      }}
                    >
                      <i className="material-icons">edit</i>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="task-modal">
          <h3>{editMode ? "Edit Task" : "Add New Task"}</h3>

          <label>Task Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter task name"
          />

          <label>Assignee</label>
          <input
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
          />

          <label>Priority</label>
          <div className="priority-box">
            {["Low", "Medium", "High"].map((p) => (
              <label key={p}>
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={form.priority === p}
                  onChange={handleChange}
                />
                {p}
              </label>
            ))}
          </div>
          <label>Type</label>

          <select
            name="todoType"
            value={form.todoType}
            onChange={handleChange}
            style={{ width: "100%" }}
          >
            <option value="Attendance">Attendance</option>
            <option value="Custom Workflow">Custom Workflow</option>
            <option value="EMPINFO">EMPINFO</option>
            <option value="LEAVE">LEAVE</option>
            <option value="LETTER">LETTER</option>
          </select>

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />

          <label>Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} />
          <label>Description</label>
          <textarea
            className="description"
            name="description"
            rows="2"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description..."
            style={{ width: "100%" }}
          ></textarea>

          <div className="modal-actions">
            <button className="save-btn" onClick={addTask}>
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {detailTask && (
        <div className="detail-modal">
          <div className="detail-header">
            <h2>{detailTask.name}</h2>
            <span className="close-icon" onClick={() => setDetailTask(null)}>
              ✖
            </span>
          </div>

          <div className="detail-body">
            <div className="detail-item">
              <span className="label">Assignee:</span>
              <span>{detailTask.assignee || "Not Assigned"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Priority:</span>
              <span className={detailTask.priority.toLowerCase()}>
                {detailTask.priority}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Due Date:</span>
              <span>{detailTask.dueDate || "No Due Date"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Status:</span>
              <span>{detailTask.status}</span>
            </div>

            {detailTask.description && (
              <div className="detail-desc">
                <h4>Description</h4>
                <p>{detailTask.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
