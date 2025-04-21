const createAdmin = async (role: string) => {
    // Mock data for demonstration purposes
    const users = [
        { id: 1, name: 'John Doe', role: 'admin' },
        { id: 2, name: 'Jane Smith', role: 'user' },
        { id: 3, name: 'Alice Johnson', role: 'admin' },
    ];

    // Filter users by the specified role
    return users.filter(user => user.role === role);
}


export const userService = {
    createAdmin
}