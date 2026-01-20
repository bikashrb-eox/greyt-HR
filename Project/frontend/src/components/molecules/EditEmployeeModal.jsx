import React, { useState, useEffect } from "react";
import "./EditEmployeeModal.css";
import { updateEmployee } from "../../services/employeeApi";

export default function EditEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        department: "",
        role: "",
        status: "Active"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pre-fill form when employee changes
    useEffect(() => {
        if (employee) {
            setFormData({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                department: employee.department,
                role: employee.role,
                status: employee.status
            });
            setError(null);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSave = async () => {
        console.log("Saving");
        try {
            setLoading(true);
            setError(null);

            const updates = {
                department: formData.department,
                designation: formData.role,
                status: formData.status.toLowerCase()
            };

            // Only add manager_id if it was part of the form (it's not currently in the UI but checking just in case)
            // The current UI doesn't have manager field for edit

            const { data, error: updateError } = await updateEmployee(employee.id, updates);

            if (updateError) throw updateError;

            console.log("Employee updated successfully:", data);
            console.log("Saved");

            // Refresh list
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (err) {
            console.error("Error updating employee:", err);
            setError(err.message || "Failed to update employee");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
        setError(null);
    };

    if (!isOpen || !employee) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Employee</h3>
                    <button className="modal-close" onClick={handleCancel}>
                        ×
                    </button>
                </div>

                {error && (
                    <div className="modal-error">
                        <span className="error-icon">⚠️</span>
                        <span className="error-text">{error}</span>
                    </div>
                )}

                <div className="modal-body">
                    <form className="employee-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Enter role/position"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
