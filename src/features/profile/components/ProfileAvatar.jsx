import { useRef } from "react";
import toast from "react-hot-toast";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "@shared/components/ui/Avatar";
import { useUploadAvatar } from "../hooks/useUpdateProfile";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * @param {{ name: string, avatarUrl?: string }} props
 */
export default function ProfileAvatar({ name, avatarUrl }) {
  const inputRef = useRef(null);
  const { mutate, isPending } = useUploadAvatar();

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be under 5MB.");
      return;
    }

    mutate(file, {
      onSuccess: () => toast.success("Avatar updated"),
      onError: (err) => toast.error(err?.message || "Upload failed"),
    });
  }

  return (
    <div className="relative inline-flex">
      <Avatar name={name} src={avatarUrl} size="xl" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        aria-label="Change avatar"
        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-brand-600 text-text-inverse transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
