"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { createClient } from "@/lib/supabase/client";
import { Upload, CheckCircle, AlertCircle, Film } from "lucide-react";

interface VideoUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export function VideoUploader({ onUploadSuccess }: VideoUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "complete" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uppyRef = useRef<Uppy | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const setupUppy = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const uppyInstance = new Uppy({
        id: "video-uploader",
        autoProceed: true,
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ["video/*"],
          maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB max input
        },
      }).use(Tus, {
        endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
        headers: {
          authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"],
      });

      uppyInstance.on("file-added", (file) => {
        const supabaseMetadata = {
          bucketName: "media",
          objectName: `videos/${Date.now()}-${file.name}`,
          contentType: file.type || "video/mp4",
        };
        file.meta = { ...file.meta, ...supabaseMetadata };
        setFileName(file.name || "video");
        setStatus("uploading");
      });

      uppyInstance.on("progress", (prog) => {
        setProgress(prog);
      });

      uppyInstance.on("complete", (result) => {
        const successful = result.successful;
        if (successful && successful.length > 0) {
          const file = successful[0];
          const objectName = file.meta.objectName as string;
          const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${objectName}`;
          setStatus("complete");
          onUploadSuccess(publicUrl);
        }
      });

      uppyInstance.on("error", (error) => {
        setErrorMsg(error.message || "Upload failed");
        setStatus("error");
      });

      uppyRef.current = uppyInstance;
    };

    setupUppy();

    return () => {
      uppyRef.current?.cancelAll();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !uppyRef.current) return;
    
    const file = files[0];
    try {
      uppyRef.current.addFile({
        name: file.name,
        type: file.type,
        data: file,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add file");
      setStatus("error");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0 || !uppyRef.current) return;
    
    const file = files[0];
    try {
      uppyRef.current.addFile({
        name: file.name,
        type: file.type,
        data: file,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add file");
      setStatus("error");
    }
  }, []);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {status === "idle" && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-hairline rounded-sm p-12 text-center cursor-pointer hover:border-ink/30 hover:bg-canvas-soft/50 transition-all"
        >
          <Upload className="w-8 h-8 text-text-muted mx-auto mb-4" />
          <p className="text-body-sm font-[500] text-ink mb-1">Drop a video here or click to browse</p>
          <p className="text-caption text-text-muted">Video files up to 2GB. MP4, WebM, MOV supported.</p>
        </div>
      )}

      {status === "uploading" && (
        <div className="border border-hairline rounded-sm p-6 bg-canvas">
          <div className="flex items-center gap-3 mb-4">
            <Film className="w-5 h-5 text-text-muted" />
            <span className="text-body-sm font-[500] text-ink truncate">{fileName}</span>
          </div>
          <div className="w-full h-2 bg-canvas-soft rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-ink rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="text-caption text-text-muted">{progress}% uploaded</p>
        </div>
      )}

      {status === "complete" && (
        <div className="border border-hairline rounded-sm p-6 bg-canvas flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-ink shrink-0" />
          <div>
            <p className="text-body-sm font-[500] text-ink">Upload complete!</p>
            <p className="text-caption text-text-muted">{fileName}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="border border-[#ef4444]/30 rounded-sm p-6 bg-[#ef4444]/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
          <div>
            <p className="text-body-sm font-[500] text-[#ef4444]">Upload failed</p>
            <p className="text-caption text-text-muted">{errorMsg}</p>
          </div>
          <button 
            onClick={() => { setStatus("idle"); setProgress(0); }}
            className="ml-auto text-body-sm text-ink hover:underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
