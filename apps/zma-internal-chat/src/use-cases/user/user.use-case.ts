async getUser(id: string): Promise<User>

async getUsers(ids: string[]): Promise<User[]>

async searchUsers(input: string, pagination: Pagination): Promise<User[]>