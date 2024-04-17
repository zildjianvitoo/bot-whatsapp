export default function adminOnly(
  author: string,
  msg = "Hanya admin yang bisa menggunakan fitur ini"
) {
  return author == "6285176734655@c.us";
}
