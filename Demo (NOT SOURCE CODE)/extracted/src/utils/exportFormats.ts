import type { TranscriptSegment } from "../app/App";

export interface ExportOptions {
  includeTimestamps?: boolean;
  includeSpeakers?: boolean;
  includeConfidence?: boolean;
  timeFormat?: "MM:SS" | "HH:MM:SS";
}

/**
 * Format time in seconds to MM:SS or HH:MM:SS format
 */
export const formatTime = (seconds: number, format: "MM:SS" | "HH:MM:SS" = "MM:SS"): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (format === "HH:MM:SS") {
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format time for SRT/VTT (HH:MM:SS,mmm or HH:MM:SS.mmm)
 */
const formatSRTTime = (seconds: number, separator: "," | "." = ","): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}${separator}${ms.toString().padStart(3, "0")}`;
};

/**
 * Export as Plain Text (.txt)
 */
export const exportAsText = (segments: TranscriptSegment[], options: ExportOptions = {}): string => {
  const {
    includeTimestamps = true,
    includeSpeakers = true,
    includeConfidence = false,
    timeFormat = "MM:SS",
  } = options;

  return segments
    .map((segment) => {
      const parts: string[] = [];

      if (includeTimestamps) {
        parts.push(
          `[${formatTime(segment.startTime, timeFormat)} - ${formatTime(segment.endTime, timeFormat)}]`
        );
      }

      if (includeSpeakers) {
        parts.push(`${segment.speaker}:`);
      }

      const text = parts.length > 0 ? `${parts.join(" ")}\n${segment.text}` : segment.text;

      if (includeConfidence && segment.confidence) {
        return `${text}\n(Confidence: ${Math.round(segment.confidence * 100)}%)\n`;
      }

      return `${text}\n`;
    })
    .join("\n");
};

/**
 * Export as SRT Subtitles (.srt)
 */
export const exportAsSRT = (segments: TranscriptSegment[], options: ExportOptions = {}): string => {
  const { includeSpeakers = true } = options;

  return segments
    .map((segment, index) => {
      const sequenceNumber = index + 1;
      const startTime = formatSRTTime(segment.startTime, ",");
      const endTime = formatSRTTime(segment.endTime, ",");
      const speaker = includeSpeakers ? `${segment.speaker}: ` : "";
      const text = `${speaker}${segment.text}`;

      return `${sequenceNumber}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join("\n");
};

/**
 * Export as WebVTT (.vtt)
 */
export const exportAsWebVTT = (segments: TranscriptSegment[], options: ExportOptions = {}): string => {
  const { includeSpeakers = true } = options;

  const header = "WEBVTT\n\n";
  const cues = segments
    .map((segment, index) => {
      const sequenceNumber = index + 1;
      const startTime = formatSRTTime(segment.startTime, ".");
      const endTime = formatSRTTime(segment.endTime, ".");

      let text: string;
      if (includeSpeakers) {
        // Use voice tags for WebVTT
        text = `<v ${segment.speaker}>${segment.text}</v>`;
      } else {
        text = segment.text;
      }

      return `${sequenceNumber}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join("\n");

  return header + cues;
};

/**
 * Export as JSON (.json)
 */
export const exportAsJSON = (segments: TranscriptSegment[], options: ExportOptions = {}): string => {
  const { includeConfidence = true } = options;

  const data = segments.map((segment) => {
    const obj: any = {
      id: segment.id,
      speaker: segment.speaker,
      text: segment.text,
      startTime: segment.startTime,
      endTime: segment.endTime,
    };

    if (includeConfidence && segment.confidence !== undefined) {
      obj.confidence = segment.confidence;
    }

    return obj;
  });

  return JSON.stringify(data, null, 2);
};

/**
 * Export as CSV (.csv)
 */
export const exportAsCSV = (segments: TranscriptSegment[], options: ExportOptions = {}): string => {
  const {
    includeConfidence = true,
    timeFormat = "MM:SS",
  } = options;

  // CSV Header
  const headers = ["ID", "Speaker", "Start Time", "End Time", "Text"];
  if (includeConfidence) {
    headers.push("Confidence");
  }

  // Escape CSV values (handle quotes and commas)
  const escapeCSV = (value: string): string => {
    if (value.includes('"') || value.includes(",") || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // CSV Rows
  const rows = segments.map((segment) => {
    const row = [
      segment.id,
      segment.speaker,
      formatTime(segment.startTime, timeFormat),
      formatTime(segment.endTime, timeFormat),
      escapeCSV(segment.text),
    ];

    if (includeConfidence) {
      const confidence = segment.confidence ? `${Math.round(segment.confidence * 100)}%` : "N/A";
      row.push(confidence);
    }

    return row.join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};

/**
 * Get MIME type for export format
 */
export const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    txt: "text/plain",
    srt: "application/x-subrip",
    vtt: "text/vtt",
    json: "application/json",
    csv: "text/csv",
  };
  return mimeTypes[format] || "text/plain";
};

/**
 * Download file to user's computer
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copy content to clipboard
 */
export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
