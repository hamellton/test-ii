import React, { useEffect, useRef } from "react";
import { SalonHistoryOverlay, SalonHistoryContainer, CloseButton, SalonHistoryTitle } from "./SalonHistory.styles";
import ExtendedSalonTable from "@components/Tables/ExtendedSalonTable/ExtendedSalonTable";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SalonHistory = ({ 
  user, 
  salons, 
  handleDelete, 
  handleApprove, 
  setIsLoading, 
  handleBroadcastModalOpen, 
  handleSalonHistory 
} : any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
        
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      handleSalonHistory(false);
    }
  };

  return (
    <SalonHistoryOverlay onClick={handleOverlayClick}>
      <CloseButton onClick={() => handleSalonHistory(false)}>
        <IconButton aria-label="close">
          <CloseIcon />
        </IconButton>
      </CloseButton>
      <SalonHistoryContainer ref={containerRef}>
        <SalonHistoryTitle>Event History</SalonHistoryTitle>
        {salons && salons.length > 0 && <ExtendedSalonTable
          user={user}
          salons={salons && salons.length > 0 ? salons : []}
          series={[]}
          handleDelete={handleDelete}
          handleApprove={handleApprove}
          setIsLoading={setIsLoading}
          handleBroadcastModalOpen={handleBroadcastModalOpen}
          handleSalonHistory={handleSalonHistory}
          showActions={false}
          showPagination={false}
        />}
      </SalonHistoryContainer>
    </SalonHistoryOverlay>
  );
};

export default SalonHistory;
