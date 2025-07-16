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

  async getUserSettings() {
    await delay(200);
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Product Manager focused on user experience and team collaboration.',
      notifications: {
        email: true,
        push: true,
        mentions: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC'
      }
    };
  },

  async updateProfile(profileData) {
    await delay(300);
    // Simulate profile update
    if (!profileData.name || !profileData.email) {
      throw new Error('Name and email are required');
    }
    return {
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio || ''
    };
  },

  async updateNotifications(notificationData) {
    await delay(300);
    // Simulate notification settings update
    return {
      notifications: { ...notificationData }
    };
  },

  async updatePreferences(preferencesData) {
    await delay(300);
    // Simulate preferences update
    return {
      preferences: { ...preferencesData }
    };
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