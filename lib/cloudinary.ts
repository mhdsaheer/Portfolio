/**
 * Uploaded images live on Cloudinary, which resizes and crops them from
 * instructions in the URL. Nothing here is secret: the cloud name is public
 * and uploads are signed by the server (app/admin/actions.ts).
 */

const UPLOAD_SEGMENT = "/image/upload/"

export function isCloudinaryUrl(src: string) {
  return src.startsWith("https://res.cloudinary.com/") && src.includes(UPLOAD_SEGMENT)
}

/**
 * The same image with a transformation applied, e.g. "c_fill,ar_4:3,g_auto"
 * for a 4:3 crop centred on what matters in the picture.
 */
export function withTransform(src: string, transformation: string) {
  return src.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transformation}/`)
}
