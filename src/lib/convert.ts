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

export function dateTimeToString(datetime: string) {
  const dateTimeString = datetime;

  // Parse the date and time string
  const date = new Date(dateTimeString);

  // Extract the date and time components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the date and time
  const formattedDate = `${day} ${getIndonesianMonthName(month)} ${year}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const formattedDateTime = `${formattedDate}, ${formattedTime}`;

  return formattedDateTime;
}

function getIndonesianMonthName(month: number) {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return monthNames[month - 1];
}
