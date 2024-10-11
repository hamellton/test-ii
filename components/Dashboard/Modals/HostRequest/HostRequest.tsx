import React, { useState, useEffect, useCallback } from "react";
import { HostRequestOverlay, HostRequestContainer, HostStatusHeading2, HostStatusParagraph, HostStatusHeading4, HostStatusButton } from "./HostRequest.styles";

interface HostRequestProps {
  user: any;
}

const HostRequest: React.FC<HostRequestProps> = ({ user }) => {
  const [isHostRequested, setIsHostRequested] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user && !user.isHost) setModalOpen(true);
  }, [isHostRequested, user]);

  const fetchHostStatus = useCallback(async () => {
    const response = await fetch(`/api/hostRequest/${user.email}`);
    const data = await response.json();
    setIsHostRequested(data.hasHostRequest);
  }, [user]);

  useEffect(() => {
    if (user && user?.email) {
      fetchHostStatus();
    }

  }, [fetchHostStatus, user]);

  const handleBecomeHost = async () => {
    await fetch("/api/hostRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email, name: user.name, status: "pending" }),
    });
    await fetchHostStatus();
  };

  return modalOpen && !user?.isHost && (
    <HostRequestOverlay>
      <HostRequestContainer>
        {isHostRequested ? (
          <div>
            <HostStatusHeading2>Thank You for Your Request</HostStatusHeading2>
            <HostStatusParagraph>Your application to become a host has been received and is currently under review. You will hear back from us soon. Thank you for your patience!</HostStatusParagraph>
          </div>
        ) : (
          <>
            <HostStatusHeading4>To create events, you need to have a host account.</HostStatusHeading4>
            <HostStatusButton onClick={handleBecomeHost} variant="contained">Become a Host</HostStatusButton>
          </>
        )}
      </HostRequestContainer>
    </HostRequestOverlay>
  );
};

export default HostRequest;
