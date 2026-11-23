export async function dataUrlToFile(dataUrl: string, fileName: string) {
  const commaIndex = dataUrl.indexOf(",");
  if (!dataUrl.startsWith("data:") || commaIndex < 0) {
    throw new Error("Invalid data URL");
  }

  const header = dataUrl.slice(5, commaIndex);
  const encodedData = dataUrl.slice(commaIndex + 1);
  const mediaType = header.split(";", 1)[0] || "image/jpeg";
  let bytes: ArrayBuffer;

  if (header.split(";").some((part) => part.toLowerCase() === "base64")) {
    const binary = atob(encodedData.replace(/\s/g, ""));
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let index = 0; index < binary.length; index += 1) {
      view[index] = binary.charCodeAt(index);
    }
    bytes = buffer;
  } else {
    const encoded = new TextEncoder().encode(decodeURIComponent(encodedData));
    bytes = encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength) as ArrayBuffer;
  }

  return new File([bytes], fileName, { type: mediaType });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}