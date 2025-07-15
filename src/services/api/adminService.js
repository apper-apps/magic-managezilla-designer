import adminData from '@/services/mockData/adminData.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  async getAll() {
    await delay(200);
    return { ...adminData };
  },

  async getSystemStats() {
    await delay(200);
    return { ...adminData.systemStats };
  },

  async getAnalytics() {
    await delay(200);
    return { ...adminData.analytics };
  },

  async updateSettings(settingsData) {
    await delay(300);
    adminData.settings = {
      ...adminData.settings,
      ...settingsData
    };
    return { ...adminData.settings };
  },

  async getSystemHealth() {
    await delay(200);
    return {
      status: 'healthy',
      uptime: '99.9%',
      lastCheck: new Date().toISOString(),
      services: {
        api: 'online',
        database: 'online',
        cache: 'degraded'
      }
    };
  }
};