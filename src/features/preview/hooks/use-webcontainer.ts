import { WebContainer } from "@webcontainer/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { useFiles } from "@/features/projects/hooks/use-files";


// singleton webcointainer instance
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

const getWebContainer  =async (): Promise<WebContainer> =>{
    if(webcontainerInstance){
        return webcontainerInstance;
    }

    if(!bootPromise){
        bootPromise = WebContainer.boot({coep:"credentialless"})

    }

    webcontainerInstance = await bootPromise;

    return webcontainerInstance;
    
}

const teardownWebContainer = () =>{
    if(webcontainerInstance){
        webcontainerInstance.teardown();
        webcontainerInstance = null;
    }
    bootPromise = null;
}

interface UseWebContainerProps{
    projectId: Id<"projects">;
    enabled: boolean;
    settings?:{
        installCommand?: string;
        devCommand?:string;
    }
}

export const useWebContainer = ({
    projectId,enabled,settings 
}:UseWebContainerProps) =>{
    const [status,setStatus] = useState<"idle" | "booting" | "installing" | "running" | "error">("idle");
    const [previewUrl,setPreviewUrl] = useState<string | null> (null);
    const [error,setError] = useState<string | null> (null);
    const [restartKey,setRestartKey] = useState(0);
    const [terminalOutput,setTerminalOutput] = useState("");

    const containerRef = useRef<WebContainer | null>(null)
    const hasStartedRef = useRef(false);

    // fetch filed from convex 
    const files = useFiles(projectId);
}