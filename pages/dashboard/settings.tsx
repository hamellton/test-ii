import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { NEWSLETTER_SUBSCRIBE, USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import { fetchGetJSON } from "@utils/api-helpers";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import styled from "styled-components";

export const SettingsPageTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 48px;
  text-align: left;
  color: #231F20;
  margin-bottom: 20px;
`;

export const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;
  margin-bottom: 10px;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  
  span {
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0.01em;
    text-align: left;
  }
`;

export default function Settings() {
  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const [notifications, setNotifications] = useState<any>({
    notifyOnCreate: false,
    notifyOnUpdate: false,
    notifyOnDelete: false,
  });

  const [isSubscribed, setIsSubscribed] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newsletter, setNewsletter] = useState<boolean>(false);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      
      if (!user || !user.email) return;

      try {
        const response = await fetch(`${NEWSLETTER_SUBSCRIBE}?email=${user.email}`);
        const data = await response.json();
        setIsSubscribed(data.status === "subscribed" ? true : data.status === "not_found" ? "not_found" : false);
        setNewsletter(data.status === "subscribed");
      } catch (error) {
        console.error("Error checking subscription status", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      checkSubscriptionStatus();
    }
  }, [user]);

  useEffect(() => {
    if (user?.isAdmin && typeof user.isAdmin === "object") {
      const userNotifications = {
        notifyOnCreate: user.isAdmin.notifyOnCreate,
        notifyOnUpdate: user.isAdmin.notifyOnUpdate,
        notifyOnDelete: user.isAdmin.notifyOnDelete,
      };
      setNotifications(userNotifications);
    }
  }, [user]);

  const handleCheckboxChange = async (event: any) => {
    const { name, checked } = event.target;
    
    if (!user || !user.userId) {
      console.error("User is not loaded or missing userId");
      return;
    }

    const updatedNotifications = {
      ...notifications,
      [name]: checked,
    };

    setNotifications(updatedNotifications);
    setLoading(true);

    try {
      const response = await fetch("/api/common/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          notifyOnCreate: updatedNotifications.notifyOnCreate,
          notifyOnUpdate: updatedNotifications.notifyOnUpdate,
          notifyOnDelete: updatedNotifications.notifyOnDelete,
        }),
      });

      if (!response.ok) {
        console.error("Error updating notification settings");
      }
    } catch (error) {
      console.error("Failed to update notification settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterChange = async (event: any) => {
    const checked = event.target.checked;
    setNewsletter(checked);

    if (!user || !user.email) {
      console.error("User or email is missing");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (checked && !isSubscribed) {
        response = await fetch(NEWSLETTER_SUBSCRIBE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });
      } else if (!checked && isSubscribed) {
        response = await fetch(NEWSLETTER_SUBSCRIBE, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });
      }

      if (response?.ok) {
        setIsSubscribed(checked);
      } else {
        console.error("Error updating newsletter subscription");
      }
    } catch (error) {
      console.error("Failed to update newsletter subscription", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout isLoading={loading}>
      <LoadingModal isLoading={loading} />
      <Box sx={{ maxWidth: 730 }}>
        <SettingsPageTitle>
          Settings
        </SettingsPageTitle>

        {user && user.email && isSubscribed !== "not_found" && (
          <FormGroup sx={{ mb: 2 }}>
            <SubTitle>Email me when...</SubTitle>
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={newsletter}
                  onChange={handleNewsletterChange}
                />
              }
              label="Newsletter"
            />
          </FormGroup>
        )}

        {user && user?.isAdmin && (
          <FormGroup>
            <SubTitle>Select Admin notifications:</SubTitle>
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={notifications.notifyOnCreate}
                  onChange={handleCheckboxChange}
                  name="notifyOnCreate"
                />
              }
              label="Notify on Create"
            />
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={notifications.notifyOnUpdate}
                  onChange={handleCheckboxChange}
                  name="notifyOnUpdate"
                />
              }
              label="Notify on Update"
            />
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={notifications.notifyOnDelete}
                  onChange={handleCheckboxChange}
                  name="notifyOnDelete"
                />
              }
              label="Notify on Delete"
            />
          </FormGroup>
        )}
      </Box>
    </DashboardLayout>
  );
}
