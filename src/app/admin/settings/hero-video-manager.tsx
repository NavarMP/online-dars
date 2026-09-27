"use client";

import { useState } from "react";
import { saveHeroVideo, deleteHeroVideo } from "./actions";
import { VideoUploader } from "@/components/admin/media/video-uploader";

interface HeroVideoManagerProps {
  currentVideoUrl: string;
}

export function HeroVideoManager({ currentVideoUrl }: HeroVideoManagerProps) {
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleUploadSuccess = (url: string) => {
    setVideoUrl(url);
    setIsUploading(false);
    setStatusMsg("Upload complete! Click 'Update Video' to save.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("videoUrl", videoUrl);

    setStatusMsg("Saving...");
    const res = await saveHeroVideo(formData);
    
    if (res.error) {
      setStatusMsg(`Error: ${res.error}`);
    } else {
      setStatusMsg("Successfully updated Hero Video!");
    }
  };

  const handleDelete = async () => {
    if (!videoUrl || !confirm("Are you sure you want to completely remove this video?")) return;
    
    setStatusMsg("Removing...");
    const res = await deleteHeroVideo(videoUrl);
    if (res.success) {
      setVideoUrl("");
      setStatusMsg("Video removed successfully!");
    } else {
      setStatusMsg("Failed to remove video.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-body font-semibold mb-2">Hero Video (Landing Page)</h3>
      <p className="text-body-sm text-text-muted mb-4">
        Upload a new high-quality background video for the main landing page, or provide an external URL. Large files will be uploaded directly to storage using chunked, resumable uploads.
      </p>

      {/* Advanced Uploader UI */}
      <div className="mb-6">
        <label className="text-label text-ink font-[600] mb-2 block">Upload New Video</label>
        <VideoUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 max-w-lg mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-label text-ink font-[600]">Current Video URL</label>
            <input 
              type="text" 
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <button type="submit" className="component-button-primary px-6 py-2 h-auto text-body-sm rounded-sm">
            Update Video
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            className="px-6 py-2 h-auto text-body-sm rounded-sm border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
          >
            Remove Video
          </button>
          {statusMsg && <span className="text-body-sm text-ink ml-4">{statusMsg}</span>}
        </div>
      </form>
    </div>
  );
}
