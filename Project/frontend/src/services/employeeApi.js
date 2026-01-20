import { supabase } from "../lib/supabaseClient";

/**
 * Employee API
 * Frontend service layer for employee-related operations
 * Uses Supabase client for database operations
 */

/**
 * Helper to handle API errors and return user-friendly messages
 * @param {Error} error - The original error object
 * @returns {Error} - Enhanced error with user-friendly message
 */
const handleApiError = (error) => {
    console.error("API Error:", error);

    // Network errors
    if (error.message === "Failed to fetch" || error.code === "PGRST000") {
        return new Error("Network connection failed. Please check your internet connection.");
    }

    // Permission errors (RLS policies)
    if (error.code === "42501" || error.message?.includes("violates row-level security policy")) {
        return new Error("You do not have permission to perform this action.");
    }

    // Duplicate key errors (Unique constraints)
    if (error.code === "23505") {
        if (error.message?.includes("email")) {
            return new Error("An employee with this email already exists.");
        }
        if (error.message?.includes("user_id")) {
            return new Error("This user is already assigned as an employee.");
        }
        return new Error("Duplicate entry found. Please check your data.");
    }

    // Foreign key errors
    if (error.code === "23503") {
        return new Error("Referenced record not found (e.g., Invalid Manager or User ID).");
    }

    // Default generic error
    return new Error("An unexpected error occurred. Please try again.");
};

/**
 * Fetch all employees
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const fetchEmployees = async () => {
    try {
        console.log("Trace: fetchEmployees started");

        // 1. Fetch employees with timeout
        const fetchPromise = supabase
            .from("employees")
            .select(
                `
        id,
        user_id,
        full_name,
        email,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .order("created_at", { ascending: false });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out after 10s")), 10000)
        );

        const { data: employees, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) throw error;

        console.log("Trace: fetched raw employees", employees?.length);

        if (!employees || employees.length === 0) {
            return { data: [], error: null };
        }

        // 2. Fetch profiles for these employees to get emails
        const userIds = employees.map(emp => emp.user_id).filter(Boolean);
        console.log("Trace: fetching profiles for userIds", userIds.length);

        let profilesMap = {};
        if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabase
                .from("profiles")
                .select("id, email, department, designation")
                .in("id", userIds);

            if (!profileError && profiles) {
                profilesMap = profiles.reduce((acc, profile) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});
            }
        }

        // 3. Merge data
        const mergedEmployees = employees.map(emp => ({
            ...emp,
            profile: profilesMap[emp.user_id] || { email: 'Unknown', department: '', designation: '' }
        }));

        console.log("Trace: fetchEmployees complete");
        return { data: mergedEmployees, error: null };
    } catch (error) {
        console.error("Trace: fetchEmployees error", error);
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetch current user's employee profile
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const fetchMyEmployeeProfile = async () => {
    try {
        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("User not authenticated");
        }

        // Fetch employee record for current user
        const { data: employee, error } = await supabase
            .from("employees")
            .select(
                `
        id,
        user_id,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .eq("user_id", user.id)
            .single();

        if (error) throw error;

        // Fetch the user's profile to get email
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email, department, designation')
            .eq('id', user.id)
            .single();

        const mergedEmployee = {
            ...employee,
            profile: profile || { email: user.email } // Fallback to auth email if profile missing
        };

        return { data: mergedEmployee, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Create a new employee
 * @param {Object} employeeData - Employee data
 * @param {string} employeeData.user_id - User ID from auth.users
 * @param {string} employeeData.profile_id - Profile ID
 * @param {string} employeeData.department - Department name
 * @param {string} employeeData.designation - Job title/role
 * @param {string} [employeeData.manager_id] - Manager's employee ID (optional)
 * @param {string} [employeeData.status='active'] - Employee status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createEmployee = async (employeeData) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .insert([
                {
                    user_id: employeeData.user_id || null,
                    full_name: employeeData.full_name,
                    email: employeeData.email,
                    department: employeeData.department,
                    designation: employeeData.designation,
                    manager_id: employeeData.manager_id || null,
                    status: employeeData.status || "active",
                },
            ])
            .select(
                `
        id,
        user_id,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Update an employee record
 * @param {string} employeeId - Employee ID
 * @param {Object} updates - Fields to update
 * @param {string} [updates.department] - Department name
 * @param {string} [updates.designation] - Job title/role
 * @param {string} [updates.manager_id] - Manager's employee ID
 * @param {string} [updates.status] - Employee status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateEmployee = async (employeeId, updates) => {
    try {
        const updateData = {};

        // Only include fields that are provided
        if (updates.department !== undefined) updateData.department = updates.department;
        if (updates.designation !== undefined) updateData.designation = updates.designation;
        if (updates.manager_id !== undefined) updateData.manager_id = updates.manager_id;
        if (updates.status !== undefined) updateData.status = updates.status;

        const { data: employee, error } = await supabase
            .from("employees")
            .update(updateData)
            .eq("id", employeeId)
            .select(
                `
        id,
        user_id,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Deactivate an employee (soft delete)
 * @param {string} employeeId - Employee ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deactivateEmployee = async (employeeId) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .update({ status: "inactive" })
            .eq("id", employeeId)
            .select(
                `
        id,
        user_id,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Reactivate an employee
 * @param {string} employeeId - Employee ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const reactivateEmployee = async (employeeId) => {
    try {
        const { data: employee, error } = await supabase
            .from("employees")
            .update({ status: "active" })
            .eq("id", employeeId)
            .select(
                `
        id,
        user_id,
        department,
        designation,
        manager_id,
        status,
        created_at
      `
            )
            .single();

        if (error) throw error;

        return { data: employee, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};
