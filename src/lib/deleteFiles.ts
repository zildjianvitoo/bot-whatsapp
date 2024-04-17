import fs from "fs";

export default function deleteFiles(files: string[]) {
  files.forEach((file) => {
    fs.unlinkSync(file);
  });
}
