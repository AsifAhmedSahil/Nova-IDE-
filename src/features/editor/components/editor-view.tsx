import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import TopNavigation from "./top-navigation";
import { useEditor } from "../hooks/use-editor";
import FileBreadcrumbs from "./file-breadcrumbs";
import { useFile } from "@/features/projects/hooks/use-files";
import Image from "next/image";
import CodeEditor from "./code-editor";

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
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

      {activeFile && <CodeEditor filename={activeFile.name} />}
    </div>
  );
};

export default EditorView;
