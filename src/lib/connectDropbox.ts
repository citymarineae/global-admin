import { Dropbox } from "dropbox";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";

const dropboxToken = process.env.DROPBOX_ACCESS_TOKEN;

if (!dropboxToken) {
  throw new Error("DROPBOX_ACCESS_TOKEN is not set in environment variables");
}

const dropbox = new Dropbox({
  accessToken: dropboxToken,
  fetch: (url: RequestInfo, init?: RequestInit) => fetch(url, init) as Promise<Response>,
});

export async function uploadToDropbox(file: File, filePath: string): Promise<string> {
  try {
    const fileContent = await file.arrayBuffer();

    const response = await dropbox.filesUpload({
      path: filePath,
      contents: fileContent,
    });

    console.log("File uploaded successfully:", response);
    if (!response.result.path_display) {
      throw new Error("Failed to retrieve uploaded file path");
    }
    const sharedLinkResponse = await dropbox.sharingCreateSharedLinkWithSettings({
      path: response.result.path_display,
      settings: {
        requested_visibility: { ".tag": "public" },
      },
    });
    console.log("Uploaded file path:", sharedLinkResponse);
    if (!sharedLinkResponse.result.url) {
      throw new Error("Failed to create shared link");
    }

    // Convert the shared link to a direct download link
    const directLink = sharedLinkResponse.result.url.replace("www.dropbox.com", "dl.dropboxusercontent.com");

    console.log("Direct download link:", directLink);
    return directLink;
  } catch (error) {
    console.error("Error uploading file to Dropbox:", error);
    throw error;
  }
}
