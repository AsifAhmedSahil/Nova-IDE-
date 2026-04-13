import { generateText, Output } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { openai  } from "@ai-sdk/openai";

const suggestionSchema = z.object({
  suggestion: z.string(),
});

let lastRequestTime = 0;

export async function POST(request: Request) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const now = Date.now();

    // rate limit (12 sec)
    if (now - lastRequestTime < 12000) {
      return NextResponse.json({ suggestion: "" });
    }

    lastRequestTime = now;

    const body = await request.json();
    // update

    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const prompt = `
File: ${fileName}

Previous lines:
${previousLines}

Current line:
${currentLine}

Before cursor:
${textBeforeCursor}

After cursor:
${textAfterCursor}

Next lines:
${nextLines}

Line number:
${lineNumber}

Suggest only the missing code at cursor.
Return empty string if nothing needed.
`;

   const { output } = await generateText({
  model: openai("gpt-4o-mini"),
  temperature: 0, 
  output: Output.object({ schema: suggestionSchema }),
  prompt,
});

    return NextResponse.json({
      suggestion: output.suggestion || "",
    });

  } catch (error) {

    console.error("Suggestion error:", error);

    // fallback instead of crashing
    return NextResponse.json({
      suggestion: "",
    });

  }
}