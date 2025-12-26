import { Paperclip } from "lucide-react";
import Link from "next/link";

function AttachmentCard({
  title,
  files,
}: {
  title: string;
  files: { Id: string; fileName: string; fileUrl: string }[];
}) {
  if (!files || files.length === 0) return null;

  return (
    <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
      <p className="font-medium flex items-center gap-2">
        <Paperclip size={16} />
        {title}
      </p>

      <div className="space-y-1">
        {files.map((file) => (
          <Link
            key={file.Id}
            href={file.fileUrl}
            target="_blank"
            className="block text-sm text-blue-600 hover:underline break-all"
          >
            {file.fileName}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AttachmentCard