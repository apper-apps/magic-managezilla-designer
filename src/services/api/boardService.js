import boardsData from '@/services/mockData/boards.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const boardService = {
  async getAll() {
    await delay(200);
    return [...boardsData];
  },

  async getById(id) {
    await delay(200);
    const board = boardsData.find(board => board.Id === id);
    if (!board) {
      throw new Error('Board not found');
    }
    return { ...board };
  },

  async create(boardData) {
    await delay(300);
    const newBoard = {
      ...boardData,
      Id: Math.max(...boardsData.map(b => b.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    boardsData.push(newBoard);
    return { ...newBoard };
  },

  async update(id, boardData) {
    await delay(300);
    const index = boardsData.findIndex(board => board.Id === id);
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    const updatedBoard = {
      ...boardsData[index],
      ...boardData,
      updatedAt: new Date().toISOString()
    };
    
    boardsData[index] = updatedBoard;
    return { ...updatedBoard };
  },

  async delete(id) {
    await delay(200);
    const index = boardsData.findIndex(board => board.Id === id);
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    boardsData.splice(index, 1);
    return { success: true };
  }
};