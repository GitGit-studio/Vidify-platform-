javascript
/**
 * Vidify Video Processing Pipeline
 * 
 * This file defines the video processing workflow used by both
 * Enterprise and Creator products.
 */

// Processing pipeline configuration
const processingPipeline = {
  version: '1.0.0',
  
  // Processing stages in sequence
  stages: [
    {
      name: 'validation',
      description: 'Validate video file format and integrity',
      enabled: true,
      configuration: {
        allowedFormats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
        maxFileSize: 8 * 1024 * 1024 * 1024, // 8GB
        integrityChecks: ['header', 'corruption']
      }
    },
    {
      name: 'extraction',
      description: 'Extract metadata and thumbnail frames',
      enabled: true,
      configuration: {
        extractMetadata: true,
        thumbnailFrames: [0, 10, 30, 60, 120], // Seconds into video
        extractAudio: false
      }
    },
    {
      name: 'analysis',
      description: 'Analyze video content for safety and categorization',
      enabled: true,
      configuration: {
        contentSafety: true,
        categoryDetection: true,
        tagGeneration: true,
        languageDetection: true
      }
    },
    {
      name: 'transcoding',
      description: 'Transcode video into multiple formats and resolutions',
      enabled: true,
      configuration: {
        formats: ['mp4', 'hls'],
        resolutions: [
          {
            name: '240p',
            width: 426,
            height: 240,
            bitrate: '500k'
          },
          {
            name: '360p',
            width: 640,
            height: 360,
            bitrate: '800k'
          },
          {
            name: '480p',
            width: 854,
            height: 480,
            bitrate: '1500k'
          },
          {
            name: '720p',
            width: 1280,
            height: 720,
            bitrate: '3000k'
          },
          {
            name: '1080p',
            width: 1920,
            height: 1080,
            bitrate: '6000k'
          }
        ],
        audioChannels: 2,
        audioBitrate: '128k',
        keyframeInterval: 2
      }
    },
    {
      name: 'enhancement',
      description: 'Optional video quality enhancements',
      enabled: false, // Disabled by default
      configuration: {
        denoising: false,
        stabilization: false,
        colorCorrection: false,
        audioNormalization: true
      }
    },
    {
      name: 'thumbnail',
      description: 'Generate and optimize thumbnails',
      enabled: true,
      configuration: {
        count: 3,
        sizes: [
          {
            name: 'small',
            width: 320,
            height: 180
          },
          {
            name: 'medium',
            width: 640,
            height: 360
          },
          {
            name: 'large',
            width: 1280,
            height: 720
          }
        ],
        format: 'jpg',
        quality: 85
      }
    },
    {
      name: 'distribution',
      description: 'Prepare files for CDN distribution',
      enabled: true,
      configuration: {
        cdnOptimization: true,
        createManifests: true,
        setMetadata: true
      }
    }
  ],
  
  // Pipeline variations
  variants: {
    // Fast processing with lower quality for previews
    'quick-preview': {
      overrides: {
        'transcoding': {
          resolutions: [
            {
              name: '360p',
              width: 640,
              height: 360,
              bitrate: '800k'
            }
          ]
        },
        'enhancement': {
          enabled: false
        }
      }
    },
    
    // High quality processing for premium content
    'premium': {
      overrides: {
        'transcoding': {
          resolutions: [
            {
              name: '480p',
              width: 854,
              height: 480,
              bitrate: '1500k'
            },
            {
              name: '720p',
              width: 1280,
              height: 720,
              bitrate: '3000k'
            },
            {
              name: '1080p',
              width: 1920,
              height: 1080,
              bitrate: '6000k'
            },
            {
              name: '4K',
              width: 3840,
              height: 2160,
              bitrate: '15000k'
            }
          ]
        },
        'enhancement': {
          enabled: true,
          configuration: {
            denoising: true,
            stabilization: true,
            colorCorrection: true,
            audioNormalization: true
          }
        }
      }
    },
    
    // Children's content with strict safety checks
    'children': {
      overrides: {
        'analysis': {
          configuration: {
            contentSafety: true,
            childrenContentFilter: true,
            safetyThreshold: 'strict'
          }
        }
      }
    }
  },
  
  // Hooks for extending the pipeline
  hooks: {
    beforeProcessing: null,
    afterValidation: null,
    afterAnalysis: null,
    afterTranscoding: null,
    afterCompletion: null
  },
  
  // Integration with AI services
  aiIntegration: {
    enabled: true,
    services: {
      contentModeration: 'aws-rekognition',
      thumbnailSelection: 'vidify-ai',
      metadataEnhancement: 'vidify-ai'
    }
  }
};

// Processing service configuration
const processingService = {
  // AWS Lambda configuration for processing tasks
  lambda: {
    region: 'us-east-1',
    functions: {
      coordinator: 'vidify-processing-coordinator',
      validator: 'vidify-video-validator',
      transcoder: 'vidify-video-transcoder',
      analyzer: 'vidify-video-analyzer',
      thumbnail: 'vidify-thumbnail-generator'
    },
    concurrency: 10,
    timeout: 900 // 15 minutes in seconds
  },
  
  // S3 bucket configuration
  storage: {
    inputBucket: 'vidify-raw-videos',
    outputBucket: 'vidify-processed-videos',
    thumbnailBucket: 'vidify-thumbnails',
    tempBucket: 'vidify-processing-temp'
  },
  
  // MediaConvert settings
  mediaConvert: {
    region: 'us-east-1',
    role: 'arn:aws:iam::account-id:role/vidify-mediaconvert-role',
    queue: 'Default',
    accelerated: true
  },
  
  // SNS topics for notifications
  notifications: {
    processingStarted: 'arn:aws:sns:us-east-1:account-id:vidify-processing-started',
    processingCompleted: 'arn:aws:sns:us-east-1:account-id:vidify-processing-completed',
    processingFailed: 'arn:aws:sns:us-east-1:account-id:vidify-processing-failed'
  }
};

module.exports = {
  processingPipeline,
  processingService
};
