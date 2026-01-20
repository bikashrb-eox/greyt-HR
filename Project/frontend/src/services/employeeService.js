import { supabase } from "../lib/supabaseClient";

/**
 * Employee Service
 * Handles all employee-related database operations using Supabase
 */

/**
 * Create a new employee record
 * @param {Object} data - Employee data
 * @param {string} data.user_id - User ID from auth.users
 * @param {string} data.profile_id - Profile ID
 * @param {string} data.department - Department name
 * @param {string} data.designation - Job title/role
 * @param {string} [data.manager_id] - Manager's employee ID (optional)
 * @param {string} [data.status='active'] - Employee status (active/inactive)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createEmployee = async (data) => {
    try {
        // Validation 1: Check if user_id exists in auth.users
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(data.user_id);

        if (userError || !user) {
            throw new Error(`Invalid user_id: User with ID ${data.user_id} does not exist in auth.users`);
        }

        // Validation 2: Check if profile_id exists in profiles table
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", data.profile_id)
            .single();

        if (profileError || !profile) {
            throw new Error(`Invalid profile_id: Profile with ID ${data.profile_id} does not exist`);
        }

        // Validation 3: Check if user_id is unique in employees table
        const { data: existingEmployee, error: existingError } = await supabase
            .from("employees")
            .select("id")
            .eq("user_id", data.user_id)
            .maybeSingle();

        if (existingEmployee) {
            throw new Error(`Duplicate user_id: An employee record already exists for user_id ${data.user_id}`);
        }

        // Validation 4: Check if manager_id is valid (if provided)
        if (data.manager_id) {
            const { data: manager, error: managerError } = await supabase
                .from("employees")
                .select("id, status")
                .eq("id", data.manager_id)
                .single();

            if (managerError || !manager) {
                throw new Error(`Invalid manager_id: Employee with ID ${data.manager_id} does not exist`);
            }

            if (manager.status === "inactive") {
                throw new Error(`Invalid manager_id: Manager with ID ${data.manager_id} is inactive`);
            }
        }

        // All validations passed, create the employee
        const { data: employee, error } = await supabase
            .from("employees")
            .insert([
                {
                    user_id: data.user_id,
                    profile_id: data.profile_id,
                    department: data.department,
                    designation: data.designation,
                    manager_id: data.manager_id || null,
                    status: data.status || "active",
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // Update profiles table with department and designation if missing
        // This keeps profiles as the source of personal and professional info
        const { error: profileUpdateError } = await supabase
            .from("profiles")
            .update({
                department: data.department,
                designation: data.designation,
            })
            .eq("id", data.profile_id)
            .is("department", null)
            .is("designation", null);

        // Log warning if profile update fails, but don't fail the employee creation
        if (profileUpdateError) {
            console.warn("Warning: Failed to update profile with department/designation:", profileUpdateError);
        }

        return { data: employee, error: null };
    } catch (error) {
        console.error("Error creating employee:", error);
        return { data: null, error };
    }
};

/**
 * Get all employees
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getEmployees = async () => {
    try {
        const { data: employees, error } = await supabase
            .from("employees")
            .select(
                `
        id,
        user_id,
        profile_id,
        department,
        designation,
        manager_id,
        status,
        created_at,
        updated_at,
        profile:profiles(email),
        manager:employees!manager_id(
          id,
          profile:profiles(email)
        )
      `
            )
            .order("created_at", { ascending: false });

        if (error) throw error;

        return { data: employees, error: null };
    } catch (error) {
        console.error("Error fetching employees:", error);
        return { data: null, error };
    }
};

/**
 * Get employee by user ID
 * @param {string} userId - User ID from auth.users
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getEmployeeByUserId = async (userId) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .select(
                `
        id,
        user_id,
        profile_id,
        department,
        designation,
        manager_id,
        status,
        created_at,
        updated_at,
        profile:profiles(email),
        manager:employees!manager_id(
          id,
          profile:profiles(email)
        )
      `
            )
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        console.error("Error fetching employee by user ID:", error);
        return { data: null, error };
    }
};

/**
 * Update employee record
 * @param {string} id - Employee ID
 * @param {Object} data - Updated employee data
 * @param {string} [data.department] - Department name
 * @param {string} [data.designation] - Job title/role
 * @param {string} [data.manager_id] - Manager's employee ID
 * @param {string} [data.status] - Employee status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateEmployee = async (id, data) => {
    try {
        // Validation: Check if manager_id is valid (if being updated)
        if (data.manager_id !== undefined && data.manager_id !== null) {
            const { data: manager, error: managerError } = await supabase
                .from("employees")
                .select("id, status")
                .eq("id", data.manager_id)
                .single();

            if (managerError || !manager) {
                throw new Error(`Invalid manager_id: Employee with ID ${data.manager_id} does not exist`);
            }

            if (manager.status === "inactive") {
                throw new Error(`Invalid manager_id: Manager with ID ${data.manager_id} is inactive`);
            }

            // Prevent self-referencing (employee cannot be their own manager)
            if (data.manager_id === id) {
                throw new Error(`Invalid manager_id: Employee cannot be their own manager`);
            }
        }

        const updateData = {};

        // Only include fields that are provided
        if (data.department !== undefined) updateData.department = data.department;
        if (data.designation !== undefined) updateData.designation = data.designation;
        if (data.manager_id !== undefined) updateData.manager_id = data.manager_id;
        if (data.status !== undefined) updateData.status = data.status;

        const { data: employee, error } = await supabase
            .from("employees")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        console.error("Error updating employee:", error);
        return { data: null, error };
    }
};

/**
 * Deactivate employee (soft delete)
 * @param {string} id - Employee ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deactivateEmployee = async (id) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .update({ status: "inactive" })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        console.error("Error deactivating employee:", error);
        return { data: null, error };
    }
};

/**
 * Reactivate employee
 * @param {string} id - Employee ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const reactivateEmployee = async (id) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .update({ status: "active" })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        console.error("Error reactivating employee:", error);
        return { data: null, error };
    }
};
