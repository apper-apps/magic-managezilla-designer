import tasksData from '@/services/mockData/tasks.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(200);
    return [...tasksData];
  },

  async getById(id) {
    await delay(200);
    const task = tasksData.find(task => task.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasksData.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: tasksData.length
    };
    tasksData.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasksData.findIndex(task => task.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasksData[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    tasksData[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasksData.findIndex(task => task.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasksData.splice(index, 1);
    return { success: true };
  }
};