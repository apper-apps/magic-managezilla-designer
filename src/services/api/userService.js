import usersData from '@/services/mockData/users.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(200);
    return [...usersData];
  },

  async getById(id) {
    await delay(200);
    const user = usersData.find(user => user.Id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(300);
    const newUser = {
      ...userData,
      Id: Math.max(...usersData.map(u => u.Id)) + 1
    };
    usersData.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = usersData.findIndex(user => user.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...usersData[index],
      ...userData
    };
    
    usersData[index] = updatedUser;
    return { ...updatedUser };
  },

  async delete(id) {
    await delay(200);
    const index = usersData.findIndex(user => user.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    usersData.splice(index, 1);
    return { success: true };
  }
};