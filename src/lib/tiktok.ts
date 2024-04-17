import tiktok from "@tobyg74/tiktok-api-dl";

export async function downloadTikTokVideo(videoUrl: string) {
  try {
    const { result } = await tiktok.Downloader(videoUrl, {
      version: "v3",
    });
    return result?.video1;
  } catch (error) {
    throw new Error("Gagal mendownload video TikTok");
  }
}
