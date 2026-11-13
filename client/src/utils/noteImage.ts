// Fragrantica serves every note/ingredient photo in several sizes under the
// same numeric id, only the file prefix changes:
//   .../sastojci/m.<id>.jpg  40x40      (what older imports stored)
//   .../sastojci/t.<id>.jpg  120x120    -> lists, chips, autocomplete
//   .../sastojci/o.<id>.jpg  ~1200x1200 -> one big photo on a detail page
// Originals weigh 16 KB - 6 MB, so never use "full" in a list.
// URLs from other hosts are returned unchanged.
export type NoteImageSize = "thumb" | "full";

const PREFIX: Record<NoteImageSize, string> = { thumb: "t", full: "o" };

export function noteImage(url: string, size: NoteImageSize): string;
export function noteImage(
  url: string | null | undefined,
  size: NoteImageSize
): string | null | undefined;
export function noteImage(
  url: string | null | undefined,
  size: NoteImageSize
): string | null | undefined {
  if (!url) return url;
  return url.replace(
    /\/sastojci\/[a-z]\.(\d+\.jpg)/i,
    `/sastojci/${PREFIX[size]}.$1`
  );
}
