// Simulated content service using localStorage

const STORAGE_KEY = 'broadcast_contents';

const getContents = () => {
  if (typeof window === 'undefined') return [];
  const contents = localStorage.getItem(STORAGE_KEY);
  return contents ? JSON.parse(contents) : [];
};

const saveContents = (contents) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
};

export const contentService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    return getContents();
  },

  getByTeacher: async (teacherId) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getContents().filter((c) => c.teacherId === teacherId);
  },

  getPublicLive: async (teacherId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const now = new Date();
    return getContents().filter((c) => 
      c.teacherId === teacherId && 
      c.status === 'APPROVED' &&
      new Date(c.startTime) <= now &&
      new Date(c.endTime) >= now
    );
  },

  create: async (contentData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const contents = getContents();
    const newContent = {
      ...contentData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    contents.push(newContent);
    saveContents(contents);
    return newContent;
  },

  updateStatus: async (contentId, status, rejectionReason = '') => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const contents = getContents();
    const index = contents.findIndex((c) => c.id === contentId);
    if (index !== -1) {
      contents[index].status = status;
      if (rejectionReason) {
        contents[index].rejectionReason = rejectionReason;
      }
      saveContents(contents);
      return contents[index];
    }
    throw new Error('Content not found');
  },
};
