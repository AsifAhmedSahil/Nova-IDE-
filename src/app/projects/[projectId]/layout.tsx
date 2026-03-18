import ProjectIdLayout from "@/features/projects/components/project-id-layout";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string }; // Next.js route param = string
}) => {
  // Convert string → Convex Id (type assertion)
  const projectId = params.projectId as Id<"projects">;

  return <ProjectIdLayout projectId={projectId}>{children}</ProjectIdLayout>;
};

export default Layout;