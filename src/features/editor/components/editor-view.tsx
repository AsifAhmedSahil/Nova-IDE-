import React, { useEffect, useRef } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import TopNavigation from "./top-navigation";
import { useEditor } from "../hooks/use-editor";
import FileBreadcrumbs from "./file-breadcrumbs";
import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";
import Image from "next/image";
import CodeEditor from "./code-editor";

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveFileBinary = !!activeFile?.storageId;
  const isActiveFileText = !!activeFile && !activeFile.storageId;

  const DEBOUNCE_MS = 1500;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeTabId]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>

      {activeTabId && <FileBreadcrumbs projectId={projectId} />}

      {!activeFile && (
        <div className="size-full flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Nova"
            width={50}
            height={50}
            className="opacity-25"
          />
        </div>
      )}

      {isActiveFileText && (
        <CodeEditor
          key={activeFile._id}
          initialValue={activeFile.content}
          onChange={(content: string) => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              updateFile({ id: activeFile._id, content });
            }, DEBOUNCE_MS);
          }}
          filename={activeFile.name}
        />
      )}
      {isActiveFileBinary && <p>TODO: Implement binary preview</p>}
    </div>
  );
};

export default EditorView;
