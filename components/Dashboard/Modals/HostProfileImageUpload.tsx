import { Box, Button } from "@mui/material";
import Image from "next/image";
// import { GravatarQuickEditorCore } from "@gravatar-com/quick-editor";
// import sha256 from "crypto-js/sha256";
// import encHex from "crypto-js/enc-hex";
import { useState } from "react";
// import useSWR from "swr";
// import { frontEndAuthResponse } from "@utils/types";
// import { USER_STATUS_ENDPOINT } from "@config";
// import { fetchGetJSON } from "@utils/api-helpers";

// function getGravatarHash(email: string | undefined): string | undefined {
//   if (!email) {
    
//     return;
//   }

//   const cleanedEmail = email.trim().toLowerCase();
//   return sha256(cleanedEmail).toString(encHex);
// }

export default function HostProfileImageUpload({
  handleProfileSelect,
  handleFileReset,
  previewUrl,
  setSelectedFile
}: {
  handleProfileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileReset: () => void;
  previewUrl: string,
  setSelectedFile: any
}) {

  // const { data: user, error: userStatusError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(previewUrl);

  // const openGravatarEditorCore = () => {
  //   if (userStatusError || !user?.email) {
  //     console.error("User email is not available");
  //     return;
  //   }

  //   const editorCore = new GravatarQuickEditorCore({
  //     email: user?.email,
  //     scope: ["avatars"],
  //     onProfileUpdated: async (type: string) => {
  //       if (type === "avatar_updated") {
  //         console.log("🚀 ~ Avatar has been updated!:");

  //         const newHash = getGravatarHash(user.email);
  //         const newPreviewUrl = `https://www.gravatar.com/avatar/${newHash}?s=200&t=${new Date().getTime()}`;

  //         const newPreviewUrlWith404 = `https://www.gravatar.com/avatar/${newHash}?t=${new Date().getTime()}&d=404`;

  //         try {
  //           const response = await fetch(newPreviewUrlWith404);
  //           const isDefaultImage = response.status === 404;
            
  //           if (!isDefaultImage) {
  //             setSelectedFile(newPreviewUrl);
  //             setAvatarUrl(newPreviewUrl);
  //           } else {
  //             // setSelectedFile(null);
  //             handleFileReset();
  //             setAvatarUrl(null);
  //           }
  //         } catch (error) {
  //           console.error("Error checking if image is default:", error);
  //         }

          
  //         // setTimeout(() => {
  //         //   setSelectedFile(newPreviewUrl);
  //         //   setAvatarUrl(newPreviewUrl);
  //         // }, 700);

  //       }
  //     },
  //     onOpened: () => {
  //       console.log("🚀 ~ Editor opened!");
  //     },
  //   });

  //   editorCore.open();
  // };

  const triggerFileInput = () => {
    document.getElementById("profile-button")?.click();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <input
        style={{ display: "none" }}
        id="profile-button"
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleProfileSelect}
      />
      {/* <Image key={avatarUrl} src={avatarUrl || "/icons/avatar.svg"} width={160} height={160} alt={"avatar image"} priority /> */}
      <Image key={previewUrl} src={previewUrl ? previewUrl : "/icons/avatar.svg"} width={160} height={160} alt={"avatar image"} priority />
      {!previewUrl &&
        <Button variant="contained" sx={{ mt: 7, mb: 2, ml: 4, height: 43 }}
          onClick={triggerFileInput}
        >
          Upload Photo
        </Button>
      }
      {previewUrl &&
        <Button variant="contained" sx={{ mt: 7, mb: 2, ml: 4, height: 43 }}
          onClick={handleFileReset}
        >
          Remove
        </Button>
      }
      {/* <Button 
        variant="contained" 
        sx={{ mt: 7, mb: 2, ml: 4, height: 43 }}
        onClick={openGravatarEditorCore}
      >
        Edit on gravatar.com
      </Button> */}
    </Box>
  );
}