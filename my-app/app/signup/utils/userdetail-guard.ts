import axios from "axios";

export async function userDetailGuard(details: { username?: string; email?: string; }): Promise<boolean> {
    if (details.email) {
        details = { email: details.email };
    }
    if (details.username) {
        details = { username: details.username };
    }
    if (!details.username && !details.email) {
        return false; // Guard fails if username or email is missing
    }

    try {
        // Method 1: Pass as separate query parameters (recommended)
        const response = await axios.get('/api/account-building/busy-details', {
            params: {
                details
            }
        });
        if (response.data.busy) {
            return false; // Guard fails if account building is busy
        }
        return true; // Guard passes
    } catch (error) {
        console.error("Error checking busy details:", error);
        return false; // On error, fail the guard
    }
}