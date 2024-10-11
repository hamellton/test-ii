import { ChangeEvent } from "react";
import { FileUploadIcon } from "@/icons/svgIcons";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import styled from "styled-components";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

interface FileUploadProps {
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFileReset: () => void;
  previewUrl: string;
}

const ResponsiveImage = styled(Image)`
  width: 100%;
  max-height: 240px;
  object-fit: cover;

  @media (max-width: 465px) {
    height: auto;
  }
`;

export default function FileUpload({ handleFileSelect, handleFileReset, previewUrl }: FileUploadProps) {

  const { device } = useDevice() ?? {};

  return (
    <>
      {previewUrl && <Box>
        <ResponsiveImage
          src={previewUrl}
          alt="Preview"
          width={694}
          height={device !== DeviceTypes.MOBILE ? 240 : 200}
        />
        <Button
          variant="outlined"
          style={{
            marginTop: "10px",
            marginBottom: "30px",
            color: "#605759",
            borderColor: "#605759"
          }}
          onClick={handleFileReset}
        >
          Remove
        </Button>
      </Box>}
      {!previewUrl && <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px dashed #AEA5A5",
          borderRadius: "4px",
          height: "240px",
          cursor: "pointer"
        }}
      >
        {/* Hidden File Input */}
        <input
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileSelect}
        />
        {/* Label Associated with File Input */}
        <label htmlFor="raised-button-file" style={{
          marginTop: "-25px", //Fix top of image
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#605759",
          width: "100%", // Make the entire div clickable
          height: "100%" // Make the entire div clickable
        }}>
          <FileUploadIcon />
          <div style={{
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "underline",
            lineHeight: "25.6px",
            color: "#000"
          }}>
            Click to upload
          </div>
          <div style={{
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "22.5px",
          }}>
            PNG or JPG (max. 3 MB)
          </div>
        </label>
      </div>}
    </>
  );
}

