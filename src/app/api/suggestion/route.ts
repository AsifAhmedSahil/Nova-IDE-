import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";

const suggestionSchema = z.object({
  suggestion: z.string().describe(
    "Code to insert at cursor or empty string if no suggestion"
  ),
});

const SUGGESTION_PROMPT = `You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>

<previous_lines>
{previousLines}
</previous_lines>

<current_line number="{lineNumber}">
{currentLine}
</current_line>

<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>

<next_lines>
{nextLines}
</next_lines>

<full_code>
{code}
</full_code>

</context>

<instructions>

1. If next_lines already continue the code → return empty string.

2. If before_cursor ends with ; } ) → return empty string.

3. Otherwise suggest the next code.

Only return the code to insert at cursor.

</instructions>
`;

export async function POST(request: Request) {
  try {
    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code required" },
        { status: 400 }
      );
    }

    // limit context to reduce tokens
    const limitedCode = code.split("\n").slice(-120).join("\n");

    const prompt = SUGGESTION_PROMPT
      .replace("{fileName}", fileName || "")
      .replace("{code}", limitedCode)
      .replace("{currentLine}", currentLine || "")
      .replace("{previousLines}", previousLines || "")
      .replace("{textBeforeCursor}", textBeforeCursor || "")
      .replace("{textAfterCursor}", textAfterCursor || "")
      .replace("{nextLines}", nextLines || "")
      .replace("{lineNumber}", String(lineNumber || 0));

    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      temperature: 0.2,
      output: Output.object({ schema: suggestionSchema }),
      prompt,
    });

    return NextResponse.json({
      suggestion: output.suggestion ?? "",
    });

  } catch (error) {
    console.error("Suggestion error:", error);

    return NextResponse.json(
      { suggestion: "" },
      { status: 200 }
    );
  }
}