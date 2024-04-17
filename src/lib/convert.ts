import { promisify } from "util";
import { exec as execCallback } from "child_process";
const exec = promisify(execCallback);

export async function convertToMp4(input: string, output: string) {
  try {
    await exec(
      `ffmpeg -i ${input} -preset superfast -crf 30 -c:v libx264 ${output}`
    );

    console.log(`Konversi video berhasil`);
    return output;
  } catch (error) {
    console.error(`Konversi video error: ${error}`);

    throw error;
  }
}
