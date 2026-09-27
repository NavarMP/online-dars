"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { createClient } from "@/lib/supabase/client";
import { Upload, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
}

export function ImageUploader({ onUploadSuccess, defaultImage }: ImageUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "complete" | "error">(defaultImage ? "complete" : "idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState(defaultImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uppyRef = useRef<Uppy | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const setupUppy = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const uppyInstance = new Uppy({
        id: "image-uploader",
        autoProceed: true,
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ["image/*"],
          maxFileSize: 10 * 1024 * 1024, // 10MB max
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
          objectName: `images/${Date.now()}-${file.name}`,
          contentType: file.type || "image/jpeg",
        };
        file.meta = { ...file.meta, ...supabaseMetadata };
        setFileName(file.name || "image");
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
          setPreviewUrl(publicUrl);
          onUploadSuccess(publicUrl);
          toast.success("Image uploaded successfully!");
        }
      });

      uppyInstance.on("error", (error) => {
        setErrorMsg(error.message || "Upload failed");
        setStatus("error");
        toast.error(error.message || "Upload failed");
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
        accept="image/*"
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
          <p className="text-body-sm font-[500] text-ink mb-1">Drop an image here or click to browse</p>
          <p className="text-caption text-text-muted">Image files up to 10MB. JPG, PNG, WEBP supported.</p>
        </div>
      )}

      {status === "uploading" && (
        <div className="border border-hairline rounded-sm p-6 bg-canvas">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-5 h-5 text-text-muted" />
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
        <div className="border border-hairline rounded-sm p-6 bg-canvas flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-ink shrink-0" />
            <div>
              <p className="text-body-sm font-[500] text-ink">Image ready</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setPreviewUrl("");
                onUploadSuccess("");
              }}
              className="ml-auto text-caption text-text-muted hover:text-ink underline"
            >
              Replace
            </button>
          </div>
          {previewUrl && (
            <div className="aspect-video w-full rounded-sm overflow-hidden bg-canvas-soft border border-hairline relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
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
            type="button"
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
