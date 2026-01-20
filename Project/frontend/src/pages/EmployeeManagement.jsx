import React, { useState, useEffect } from "react";
import "./EmployeeManagement.css";
import AddEmployeeModal from "../components/molecules/AddEmployeeModal";
import ViewEmployeeModal from "../components/molecules/ViewEmployeeModal";
import EditEmployeeModal from "../components/molecules/EditEmployeeModal";
import { fetchEmployees, deactivateEmployee, reactivateEmployee } from "../services/employeeApi";

export default function EmployeeManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Employee data state
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees on component mount
    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            console.log("Trace: loadEmployees started");
            setLoading(true);
            setError(null);
            const { data, error: fetchError } = await fetchEmployees();
            console.log("Trace: loadEmployees fetch returned", { dataLen: data?.length, error: fetchError });

            if (fetchError) throw fetchError;

            // Transform data to match UI expectations
            const transformedEmployees = data?.map(emp => ({
                id: emp.id,
                name: emp.full_name || 'Unknown',
                email: emp.email || 'No email',
                department: emp.department || 'Not assigned',
                role: emp.designation || 'Not assigned',
                status: emp.status === 'active' ? 'Active' : 'Inactive',
                user_id: emp.user_id,
                manager_id: emp.manager_id
            })) || [];

            setEmployees(transformedEmployees);
            console.log("Loaded");
        } catch (err) {
            console.error("Error loading employees:", err);
            setError(err.message || "Failed to load employees");
        } finally {
            console.log("Trace: loadEmployees finally block");
            setLoading(false);
        }
    };

    // Modal handlers
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedEmployee(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
    };

    // Action handlers
    const handleView = (employee) => {
        console.log("View employee:", employee);
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    const handleEdit = (employee) => {
        console.log("Edit employee:", employee);
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDisable = async (employee) => {
        const action = employee.status === "Active" ? "disable" : "enable";
        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${employee.name}?`
        );

        if (!confirmed) {
            console.log(`${action} cancelled for ${employee.name}`);
            return;
        }

        try {
            setLoading(true);
            if (employee.status === "Active") {
                await deactivateEmployee(employee.id);
            } else {
                await reactivateEmployee(employee.id);
            }
            // Refresh list
            await loadEmployees();
        } catch (err) {
            console.error(`Error ${action}ing employee:`, err);
            setError(`Failed to ${action} employee`);
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <div className="content-area">
                <div className="page-body">
                    <div className="page-navbar">
                        <h2>Employee Management</h2>
                        <button className="btn-add-employee" onClick={openModal}>
                            + Add Employee
                        </button>
                    </div>

                    <div className="employee-management-container">
                        <div className="page-content">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Loading employees...</p>
                                </div>
                            ) : error ? (
                                <div className="error-state">
                                    <div className="error-icon">⚠️</div>
                                    <h3>Error Loading Employees</h3>
                                    <p>{error}</p>
                                    <button className="btn-retry" onClick={loadEmployees}>
                                        Retry
                                    </button>
                                </div>
                            ) : employees.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">👥</div>
                                    <h3>No Employees Found</h3>
                                    <p>Get started by adding your first employee</p>
                                    <button className="btn-add-employee" onClick={openModal}>
                                        + Add Employee
                                    </button>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="employee-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Department</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((employee) => (
                                                <tr key={employee.id}>
                                                    <td className="employee-name">{employee.name}</td>
                                                    <td>{employee.email}</td>
                                                    <td>{employee.department}</td>
                                                    <td>{employee.role}</td>
                                                    <td>
                                                        <span className={`status-badge ${employee.status.toLowerCase()}`}>
                                                            {employee.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-view"
                                                                onClick={() => handleView(employee)}
                                                                disabled={employee.status === "Inactive"}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => handleEdit(employee)}
                                                                disabled={employee.status === "Inactive"}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn-disable"
                                                                onClick={() => handleDisable(employee)}
                                                            >
                                                                {employee.status === "Active" ? "Disable" : "Enable"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {/* Modal */}
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSuccess={loadEmployees}
            />
            <ViewEmployeeModal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                employee={selectedEmployee}
            />
            <EditEmployeeModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                employee={selectedEmployee}
                onSuccess={loadEmployees}
            />
        </div>
    );
}
