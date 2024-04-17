import tiktok from "@tobyg74/tiktok-api-dl";
const { tikdown } = require("nayan-media-downloader");
export async function downloadTikTokVideo(videoUrl: string) {
  try {
    let { data } = await tikdown(videoUrl);
    // const { result } = await tiktok.Downloader(videoUrl, {
    //   version: "v2",
    // });
    return data?.video;
  } catch (error) {
    throw new Error("Gagal mendownload video TikTok");
  }
}
