import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";
import { Id } from "./_generated/dataModel";

export const getFiles = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))

      .collect();
  },
});
export const getFile = query({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("project not found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }

    return file;
  },
});

export const getFolderContents = query({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )

      .collect();

    //   sort folders first then files alphabetically within each group

    return files.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;

      return a.name.localeCompare(b.name);
    });
  },
});
export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }
    // check file with the same name already exist or not
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )

      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "file",
    );

    if (existing) throw new Error("File already exists!");

    await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,
      content: args.content,
      type: "file",
      parentId: args.parentId,
      updatedAt: Date.now(),
    });
  },
});
export const createFolder = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }
    // check folder with the same name already exist or not
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )

      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "folder",
    );

    if (existing) throw new Error("Folder already exists!");

    await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,

      type: "folder",
      parentId: args.parentId,
      updatedAt: Date.now(),
    });
  },
});

export const renameFile = mutation({
  args: {
    id: v.id("files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const file = await ctx.db.get("files", args.id);

    if (!file) throw new Error("File not found!");

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }

    // check file with the new name already exist in the parent folder or not

    const sibilings = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", file.projectId).eq("parentId", file.parentId),
      )
      .collect();

    const existing = sibilings.find((sibilings)=> sibilings.name === args.newName && sibilings.type === file.type && sibilings._id !== args.id)

    if(existing){
        throw new Error(
            `A ${file.type} with this name already exisit in this location.` 
        )
    }

    await ctx.db.patch("files",args.id,{
        name:args.newName,
        updatedAt:Date.now()
    })
  },
});
export const deleteFile = mutation({
  args: {
    id: v.id("files"),
    
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const file = await ctx.db.get("files", args.id);

    if (!file) throw new Error("File not found!");

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project not found!");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project.");
    }

    // recursively delete file/fodler and all descendants

    const deleteRecursive  = async(fileId: Id<"files"> ) =>{
        
    }
  },
});
