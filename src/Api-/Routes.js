```javascript
/**
 * Vidify API Routes
 * Defines the API endpoints for both Enterprise and Creator products
 */

// Core video management endpoints
const videoEndpoints = {
  // Video CRUD operations
  list: {
    method: 'GET',
    path: '/api/videos',
    description: 'List videos with filtering and pagination',
    permissions: ['user'],
    queryParams: ['channelId', 'status', 'limit', 'offset', 'sort']
  },
  get: {
    method: 'GET',
    path: '/api/videos/:videoId',
    description: 'Get a specific video by ID',
    permissions: ['user'],
    pathParams: ['videoId']
  },
  create: {
    method: 'POST',
    path: '/api/videos',
    description: 'Upload a new video',
    permissions: ['creator', 'admin'],
    bodyParams: ['title', 'description', 'channelId', 'file']
  },
  update: {
    method: 'PUT',
    path: '/api/videos/:videoId',
    description: 'Update video metadata',
    permissions: ['creator', 'admin'],
    pathParams: ['videoId'],
    bodyParams: ['title', 'description', 'tags', 'thumbnail']
  },
  delete: {
    method: 'DELETE',
    path: '/api/videos/:videoId',
    description: 'Delete a video',
    permissions: ['creator', 'admin'],
    pathParams: ['videoId']
  }
};

// Channel management endpoints
const channelEndpoints = {
  list: {
    method: 'GET',
    path: '/api/channels',
    description: 'List channels the user has access to',
    permissions: ['user'],
    queryParams: ['limit', 'offset']
  },
  get: {
    method: 'GET',
    path: '/api/channels/:channelId',
    description: 'Get a specific channel by ID',
    permissions: ['user'],
    pathParams: ['channelId']
  },
  create: {
    method: 'POST',
    path: '/api/channels',
    description: 'Create a new channel',
    permissions: ['creator', 'admin'],
    bodyParams: ['name', 'description', 'type']
  },
  update: {
    method: 'PUT',
    path: '/api/channels/:channelId',
    description: 'Update channel details',
    permissions: ['creator', 'admin'],
    pathParams: ['channelId'],
    bodyParams: ['name', 'description', 'branding']
  },
  delete: {
    method: 'DELETE',
    path: '/api/channels/:channelId',
    description: 'Delete a channel',
    permissions: ['admin'],
    pathParams: ['channelId']
  }
};

// User management endpoints
const userEndpoints = {
  register: {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register a new user',
    permissions: ['public'],
    bodyParams: ['email', 'password', 'name']
  },
  login: {
    method: 'POST',
    path: '/api/auth/login',
    description: 'User login',
    permissions: ['public'],
    bodyParams: ['email', 'password']
  },
  profile: {
    method: 'GET',
    path: '/api/users/me',
    description: 'Get current user profile',
    permissions: ['user']
  },
  updateProfile: {
    method: 'PUT',
    path: '/api/users/me',
    description: 'Update user profile',
    permissions: ['user'],
    bodyParams: ['name', 'avatar', 'bio']
  }
};

// AI content generation endpoints
const aiEndpoints = {
  generateIdeas: {
    method: 'POST',
    path: '/api/ai/ideas',
    description: 'Generate content ideas',
    permissions: ['creator', 'admin'],
    bodyParams: ['channelId', 'count', 'topics']
  },
  enhanceThumbnail: {
    method: 'POST',
    path: '/api/ai/thumbnail',
    description: 'Generate or enhance thumbnails',
    permissions: ['creator', 'admin'],
    bodyParams: ['videoId', 'preferences']
  },
  optimizeMetadata: {
    method: 'POST',
    path: '/api/ai/optimize',
    description: 'Optimize title, description, and tags',
    permissions: ['creator', 'admin'],
    bodyParams: ['videoId', 'target']
  },
  analyzePerformance: {
    method: 'GET',
    path: '/api/ai/analysis/:videoId',
    description: 'Get AI-powered performance analysis',
    permissions: ['creator', 'admin'],
    pathParams: ['videoId']
  }
};

// Enterprise-specific endpoints
const enterpriseEndpoints = {
  branding: {
    method: 'PUT',
    path: '/api/enterprise/branding',
    description: 'Update white-label branding',
    permissions: ['admin'],
    bodyParams: ['logo', 'colors', 'domain']
  },
  users: {
    method: 'GET',
    path: '/api/enterprise/users',
    description: 'List organization users',
    permissions: ['admin'],
    queryParams: ['limit', 'offset', 'role']
  },
  addUser: {
    method: 'POST',
    path: '/api/enterprise/users',
    description: 'Add user to organization',
    permissions: ['admin'],
    bodyParams: ['email', 'role', 'permissions']
  },
  analytics: {
    method: 'GET',
    path: '/api/enterprise/analytics',
    description: 'Get organization-wide analytics',
    permissions: ['admin'],
    queryParams: ['startDate', 'endDate', 'metrics']
  }
};

// Creator-specific endpoints
const creatorEndpoints = {
  publish: {
    method: 'POST',
    path: '/api/creator/publish',
    description: 'Publish to external platforms',
    permissions: ['creator'],
    bodyParams: ['videoId', 'platforms', 'scheduledTime']
  },
  platforms: {
    method: 'GET',
    path: '/api/creator/platforms',
    description: 'List connected platforms',
    permissions: ['creator']
  },
  connectPlatform: {
    method: 'POST',
    path: '/api/creator/platforms',
    description: 'Connect to external platform',
    permissions: ['creator'],
    bodyParams: ['platform', 'credentials']
  },
  growthAnalytics: {
    method: 'GET',
    path: '/api/creator/growth',
    description: 'Get channel growth analytics',
    permissions: ['creator'],
    queryParams: ['channelId', 'period']
  }
};

// Combine all endpoints
const apiRoutes = {
  videos: videoEndpoints,
  channels: channelEndpoints,
  users: userEndpoints,
  ai: aiEndpoints,
  enterprise: enterpriseEndpoints,
  creator: creatorEndpoints
};

module.exports = apiRoutes;
```
