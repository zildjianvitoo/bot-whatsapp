import { promisify } from "util";
import { exec as execCallback } from "child_process";
const exec = promisify(execCallback);

export async function convert(input: string, output: string) {
  try {
    // Menjalankan perintah ffmpeg
    await exec(
      `ffmpeg -i ${input} -preset superfast -crf 30 -c:v libx264 ${output}`
    );

    console.log(`Konversi video berhasil`);
    return output;
  } catch (error) {
    console.error(`Konversi video error: ${error}`);
    // Anda mungkin ingin melempar kembali error di sini untuk menangani dengan lebih baik
    throw error;
  }
}
