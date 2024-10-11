import sha256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";

function getGravatarHash(email: string | undefined): string | undefined {
  if (!email) {
      
    return;
  }
  
  const cleanedEmail = email.trim().toLowerCase();
  return sha256(cleanedEmail).toString(encHex);
}

export async function checkGravatarImage(email: string | undefined): Promise<string | null> {
  if (!email) {
    return null;
  }

  const gravatarHash = getGravatarHash(email);
  if (!gravatarHash) {
    return null;
  }

  const newPreviewUrl = `https://www.gravatar.com/avatar/${gravatarHash}?s=200&t=${new Date().getTime()}`;
  const newPreviewUrlWith404 = `https://www.gravatar.com/avatar/${gravatarHash}?t=${new Date().getTime()}&d=404`;

  try {
    const response = await fetch(newPreviewUrlWith404);
    const isDefaultImage = response.status === 404;

    if (!isDefaultImage) {
      return newPreviewUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking if image is default:", error);
    return null;
  }
}
