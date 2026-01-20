import React from "react";
import "./ViewEmployeeModal.css";

export default function ViewEmployeeModal({ isOpen, onClose, employee }) {
    if (!isOpen || !employee) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Employee Details</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="employee-details">
                        <div className="detail-row">
                            <label>Full Name</label>
                            <div className="detail-value">{employee.name}</div>
                        </div>

                        <div className="detail-row">
                            <label>Email</label>
                            <div className="detail-value">{employee.email}</div>
                        </div>

                        <div className="detail-row">
                            <label>Department</label>
                            <div className="detail-value">{employee.department}</div>
                        </div>

                        <div className="detail-row">
                            <label>Role</label>
                            <div className="detail-value">{employee.role}</div>
                        </div>

                        <div className="detail-row">
                            <label>Status</label>
                            <div className="detail-value">
                                <span className={`status-badge ${employee.status.toLowerCase()}`}>
                                    {employee.status}
                                </span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <label>Employee ID</label>
                            <div className="detail-value">#{employee.id}</div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
