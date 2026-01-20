import React, { useState } from "react";
import "./AddEmployeeModal.css";
import { createEmployee } from "../../services/employeeApi";
import { supabase } from "../../lib/supabaseClient";

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        department: "",
        role: "",
        manager: "",
        status: "Active"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSave = async () => {
        console.log("Saving");
        try {
            setLoading(true);
            setError(null);

            // Create employee data (no user_id needed - employees are independent)
            const employeeData = {
                full_name: formData.fullName,
                email: formData.email,
                department: formData.department,
                designation: formData.role,
                status: formData.status.toLowerCase()
            };

            // Call API to create employee
            const { data, error: createError } = await createEmployee(employeeData);

            if (createError) throw createError;

            console.log("Employee created successfully:", data);
            console.log("Saved");

            // Reset form
            setFormData({
                fullName: "",
                email: "",
                department: "",
                role: "",
                manager: "",
                status: "Active"
            });

            // Call onSuccess callback to refresh employee list
            if (onSuccess) {
                onSuccess();
            }

            // Close modal on success
            onClose();
        } catch (err) {
            console.error("Error creating employee:", err);
            setError(err.message || "Failed to create employee. Please try again.");
            // Do NOT close modal on failure
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        console.log("Cancel add employee");
        // Reset form and error on cancel
        setFormData({
            fullName: "",
            email: "",
            department: "",
            role: "",
            manager: "",
            status: "Active"
        });
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Employee</h3>
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
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
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
                            <label htmlFor="manager">Manager</label>
                            <input
                                type="text"
                                id="manager"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                placeholder="Enter manager name"
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
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
