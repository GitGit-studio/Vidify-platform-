javascript
/**
 * VideoUploader Component
 * 
 * A reusable video upload component for the Vidify platform.
 * Used by both Enterprise and Creator products.
 */

import React, { useState, useRef } from 'react';

const VideoUploader = ({
  channelId,
  onUploadComplete = () => {},
  onError = () => {},
  maxFileSize = 8 * 1024 * 1024 * 1024, // 8GB
  allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  isEnterprise = false,
  aiEnhancement = true
}) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [isKidsContent, setIsKidsContent] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [aiOptions, setAiOptions] = useState({
    generateThumbnail: true,
    optimizeMetadata: true,
    enhanceQuality: false
  });
  
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setError(`File too large. Maximum size: ${maxFileSize / (1024 * 1024 * 1024)}GB`);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Auto-generate title from filename
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
    setTitle(fileName);
  };
  
  // Handle tag input
  const handleTagInput = (input) => {
    const newTags = input.split(',').map(tag => tag.trim());
    setTags(newTags.filter(tag => tag !== ''));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!title) {
      setError('Please enter a title');
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      
      // In a real implementation, this would use the APIs defined in our routes.js
      // Simulating upload progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i / totalSteps * 100);
      }
      
      // Simulated response from server
      const response = {
        videoId: `vid-${Date.now()}`,
        status: 'processing',
        uploadedAt: new Date().toISOString()
      };
      
      setUploading(false);
      setProgress(0);
      
      // Clear form
      setFile(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setIsKidsContent(false);
      setIsPrivate(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component
      onUploadComplete(response);
      
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      onError(err);
      console.error('Error uploading video:', err);
    }
  };
  
  return (
    <div className="vidify-uploader">
      <h2>Upload Video</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* File input */}
        <div>
          <label htmlFor="video-file">Select Video File:</label>
          <input
            ref={fileInputRef}
            type="file"
            id="video-file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && (
            <div>
              <strong>Selected file:</strong> {file.name} ({Math.round(file.size / (1024 * 1024))} MB)
            </div>
          )}
        </div>
        
        {/* Title input */}
        <div>
          <label htmlFor="video-title">Title:</label>
          <input
            type="text"
            id="video-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
            required
          />
        </div>
        
        {/* Description input */}
        <div>
          <label htmlFor="video-description">Description:</label>
          <textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
            rows={4}
          />
        </div>
        
        {/* Tags input */}
        <div>
          <label htmlFor="video-tags">Tags (comma separated):</label>
          <input
            type="text"
            id="video-tags"
            value={tags.join(', ')}
            onChange={(e) => handleTagInput(e.target.value)}
            disabled={uploading}
            placeholder="e.g. tutorial, programming, vidify"
          />
        </div>
        
        {/* Privacy options */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={uploading}
            />
            Private video
          </label>
        </div>
        
        {/* Kids content option */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={isKidsContent}
              onChange={(e) => setIsKidsContent(e.target.checked)}
              disabled={uploading}
            />
            This is children's content
          </label>
        </div>
        
        {/* AI enhancement options */}
        {aiEnhancement && (
          <div>
            <h3>AI Enhancement</h3>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={aiOptions.generateThumbnail}
                  onChange={(e) => setAiOptions({...aiOptions, generateThumbnail: e.target.checked})}
                  disabled={uploading}
                />
                Auto-generate thumbnail
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={aiOptions.optimizeMetadata}
                  onChange={(e) => setAiOptions({...aiOptions, optimizeMetadata: e.target.checked})}
                  disabled={uploading}
                />
                Optimize title and description
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={aiOptions.enhanceQuality}
                  onChange={(e) => setAiOptions({...aiOptions, enhanceQuality: e.target.checked})}
                  disabled={uploading}
                />
                Enhance video quality
              </label>
            </div>
          </div>
        )}
        
        {/* Enterprise-only options */}
        {isEnterprise && (
          <div>
            <h3>Enterprise Options</h3>
            {/* Add enterprise-specific options here */}
            <div>
              <label>
                <input
                  type="checkbox"
                  disabled={uploading}
                />
                Add to content library
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  disabled={uploading}
                />
                Require approval before publishing
              </label>
            </div>
          </div>
        )}
        
        {/* Upload button */}
        <div>
          <button
            type="submit"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
        
        {/* Progress bar */}
        {uploading && (
          <div>
            <progress value={progress} max="100" />
            <div>{Math.round(progress)}%</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoUploader;
