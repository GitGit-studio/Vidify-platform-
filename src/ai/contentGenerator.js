javascript
/**
 * AI Content Generation Configuration
 * 
 * Defines the AI-powered content generation capabilities for both
 * Enterprise and Creator products.
 */

// Base AI configuration
const baseAIConfig = {
  version: '1.0.0',
  
  // AI Provider configurations
  providers: {
    primary: {
      name: 'vidify-ai',
      apiEndpoint: 'https://api.vidify.ai/generate',
      apiVersion: 'v1',
      timeout: 30000, // 30 seconds
      retries: 3
    },
    fallback: {
      name: 'openai',
      apiEndpoint: 'https://api.openai.com/v1',
      apiVersion: '2023-05-15',
      models: {
        text: 'gpt-4',
        vision: 'gpt-4-vision-preview'
      },
      timeout: 60000, // 60 seconds
      retries: 2
    }
  },
  
  // Default parameters
  defaults: {
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    presencePenalty: 0.1,
    frequencyPenalty: 0.1
  }
};

// Content generation capabilities
const contentGenerationCapabilities = {
  // Title generation and optimization
  titleGeneration: {
    enabled: true,
    models: ['text-only', 'video-aware'],
    maxLength: 100,
    styles: ['descriptive', 'engaging', 'clickbait', 'professional', 'educational'],
    platforms: ['youtube', 'tiktok', 'instagram', 'enterprise'],
    customization: {
      keywords: true,
      brandVoice: true,
      audienceTarget: true
    },
    enterpriseFeatures: {
      brandCompliance: true,
      industrySpecific: true,
      approvalWorkflow: true
    },
    creatorFeatures: {
      trendAwareness: true,
      searchOptimization: true,
      abTesting: true
    }
  },
  
  // Description generation
  descriptionGeneration: {
    enabled: true,
    models: ['text-only', 'video-aware'],
    maxLength: 5000,
    formats: ['paragraph', 'bullet-points', 'structured'],
    customization: {
      keywords: true,
      links: true,
      callToAction: true,
      timestamps: true
    },
    enterpriseFeatures: {
      brandCompliance: true,
      legalDisclaimer: true,
      multiLanguage: true
    },
    creatorFeatures: {
      searchOptimization: true,
      engagement: true
    }
  },
  
  // Tag generation
  tagGeneration: {
    enabled: true,
    models: ['text-only', 'video-aware'],
    maxTags: 30,
    strategies: ['broad', 'specific', 'trending', 'niche'],
    customization: {
      brandTags: true,
      categoryFocus: true
    }
  },
  
  // Thumbnail generation and enhancement
  thumbnailGeneration: {
    enabled: true,
    models: ['image-gen', 'video-frame-enhanced'],
    resolutions: ['hd', '4k'],
    styles: ['clean', 'dramatic', 'minimalist', 'text-overlay'],
    abTesting: true,
    customization: {
      textOverlay: true,
      branding: true,
      colorScheme: true
    },
    enterpriseFeatures: {
      brandCompliance: true,
      templateBased: true
    },
    creatorFeatures: {
      clickOptimization: true,
      trendAwareness: true
    }
  },
  
  // Content idea generation
  ideaGeneration: {
    enabled: true,
    models: ['text-only', 'trend-aware'],
    categories: ['how-to', 'educational', 'entertainment', 'product', 'thought-leadership'],
    customization: {
      audienceTarget: true,
      difficultyLevel: true,
      contentLength: true,
      topicFocus: true
    },
    enterpriseFeatures: {
      industrySpecific: true,
      campaignAlignment: true,
      contentCalendarIntegration: true
    },
    creatorFeatures: {
      trendAlignment: true,
      audienceGrowth: true,
      monetizationFocus: true
    }
  },
  
  // Script generation
  scriptGeneration: {
    enabled: true,
    models: ['text-only', 'video-aware'],
    formats: ['dialogue', 'monologue', 'interview', 'tutorial'],
    maxLength: 10000,
    customization: {
      tone: true,
      pacing: true,
      callouts: true,
      hooks: true
    },
    enterpriseFeatures: {
      brandCompliance: true,
      legalReview: true,
      multiSpeaker: true
    },
    creatorFeatures: {
      engagementOptimization: true,
      personalStyle: true
    }
  }
};

// Content safety and moderation
const contentSafety = {
  enabled: true,
  
  // Moderation filters
  moderationLevels: {
    standard: {
      profanity: 0.7,
      hateSpeech: 0.9,
      violence: 0.8,
      sexualContent: 0.9
    },
    strict: {
      profanity: 0.4,
      hateSpeech: 0.7,
      violence: 0.6,
      sexualContent: 0.7
    },
    childrensContent: {
      profanity: 0.1,
      hateSpeech: 0.3,
      violence: 0.3,
      sexualContent: 0.1,
      educationalValue: 0.8
    }
  },
  
  // Content guidelines enforcement
  guidelines: {
    enforceFactualAccuracy: true,
    preventMisleadingContent: true,
    preventCopyrightViolation: true,
    preventImpersonation: true
  },
  
  // Override options
  overrides: {
    allowExplicitEducational: true, // For educational content about sensitive topics
    allowNewsReporting: true        // For coverage of sensitive news events
  }
};

// AI usage analytics and optimization
const analyticsAndOptimization = {
  collectUsageData: true,
  metrics: {
    userEngagement: true,
    contentPerformance: true,
    modelAccuracy: true,
    generationTime: true
  },
  optimization: {
    automaticModelFinetuning: true,
    userFeedbackLoop: true,
    abTestingFramework: true
  }
};

// AI personalization
const personalization = {
  enabled: true,
  
  // Enterprise personalization
  enterprise: {
    brandVoice: true,
    industryContext: true,
    audienceTargeting: true,
    contentHistory: true
  },
  
  // Creator personalization
  creator: {
    creatorStyle: true,
    audiencePreferences: true,
    performanceHistory: true,
    niche: true
  }
};

// Combine all configurations
const aiContentGenerator = {
  baseConfig: baseAIConfig,
  capabilities: contentGenerationCapabilities,
  safety: contentSafety,
  analytics: analyticsAndOptimization,
  personalization: personalization,
  
  // Function to get capability configuration
  getCapabilityConfig(capability, productType, customOptions = {}) {
    if (!this.capabilities[capability]) {
      throw new Error(`Unknown capability: ${capability}`);
    }
    
    const baseConfig = this.capabilities[capability];
    
    // Apply product-specific features
    let productFeatures = {};
    if (productType === 'enterprise' && baseConfig.enterpriseFeatures) {
      productFeatures = baseConfig.enterpriseFeatures;
    } else if (productType === 'creator' && baseConfig.creatorFeatures) {
      productFeatures = baseConfig.creatorFeatures;
    }
    
    // Combine configurations
    return {
      ...baseConfig,
      ...productFeatures,
      ...customOptions,
      enabled: baseConfig.enabled
    };
  }
};

module.exports = aiContentGenerator;
