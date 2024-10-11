import { ZoomMeetingInput, ZoomMeetingResponse, ZoomStatus, ZoomUser } from "@utils/types";
import { getSalonById } from "@models/salon";
import axios from "axios";

const clientId = process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_CLIENT_SECRET;
const accountID = process.env.ZOOM_ACCOUNT_ID;

type ZoomTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

const getZoomBearerToken = async (): Promise<ZoomTokenResponse> => {
  const body = new URLSearchParams();
  body.append("grant_type", "account_credentials");
  body.append("account_id", accountID as string);

  const response = await fetch(process.env.ZOOM_TOKEN_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: body.toString(),
  });

  if (response.ok) return response.json();
  throw { status: response.status, message: response.statusText, origin: "Zoom get bearer token" };
};

export const createZoomUser = async (email: string): Promise<ZoomUser> => {
  // This request keeps returning 201 while the zoom status is still pending
  // Upon confirming, the status changes to 'active' and this request throws a 409
  const token = await getZoomBearerToken();
  const response = await fetch(process.env.ZOOM_API_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    },
    body: JSON.stringify({
      action: "create",
      user_info: {
        email: `${email}`,
        type: 1,
      },
    })
  });

  if (response.ok) return response.json();
  console.log("Error Getting Zoom Token: ", response);
  throw { status: response.status, message: "Error creating Zoom User" };
};

export const getZoomStatus = async (email: string): Promise<ZoomStatus> => {
  const token = await getZoomBearerToken();
  const response = await fetch(`${process.env.ZOOM_API_URL}/users/${email}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token.access_token}` },
  });
  if (response.ok) {
    const data = await response.json();
    return data.status === "pending" ? "sent" : data.status === "active" ? "confirmed" : "new";
  } else if (response.status === 404) {
    return "new";
  }
  console.log("Error getting Zoom Status:", response);
  throw { status: response.status, message: "Error getting Zoom User" };
};

export const getZoomUser = async (email: string): Promise<ZoomUser> => {
  const token = await getZoomBearerToken();
  const response = await fetch(`${process.env.ZOOM_API_URL}/users/${email}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token.access_token}` },
  });
  if (response.ok) return response.json();
  console.log("Error getting Zoom User: ", response);
  throw { status: response.status, message: "Error getting Zoom User" };
};

export const deleteZoomUser = async (email: string): Promise<void> => {
  const token = await getZoomBearerToken();
  const response = await fetch(`${process.env.ZOOM_API_URL}/users/${email}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token.access_token}` },
  });
  console.log("Error deleting Zoom User: ", response);
  if (!response.ok) throw { status: response.status, message: "Error deleting Zoom User" };
};

export const createZoomMeeting = async (info: ZoomMeetingInput): Promise<ZoomMeetingResponse> => {
  const token = await getZoomBearerToken();

  const response = await fetch(`${process.env.ZOOM_API_URL}/users/${process.env.ZOOM_ADMIN_ACCOUNT}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    },
    body: JSON.stringify({
      "topic": info.name,
      "agenda": info.description,
      "duration": info.duration,
      "start_time": new Date(info.startTime).toISOString(), //Timezone defaults to UTC so we don't need to specify it in the requst
      "type": 2, // 1 for instant meeting, 2 for scheduled meeting
      "settings": info.settings
    })
  });

  if (response.ok) {
    return response.json();
  };
  console.log("Error creating Zoom meeting: ", response);
  throw { status: response.status, message: "Error creating Zoom Meeting" };
};

export const updateZoomMeeting = async (salonId: string, info: ZoomMeetingInput) => {
  const token = await getZoomBearerToken();
  const salon = await getSalonById(salonId);
  if (salon!.zoomId) {
    const response = await fetch(`${process.env.ZOOM_API_URL}/meetings/${salon!.zoomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.access_token}`
      },
      body: JSON.stringify({
        "topic": info.name,
        "agenda": info.description,
        "duration": info.duration,
        "start_time": info.startTime.toString(), //Timezone defaults to UTC so we don't need to specify it in the requst
        "settings": info.settings
      })
    });

    if (!response.ok) {
      console.log("Error updating Zoom Meeting: ", response);
      throw { status: response.status, message: "Error editing Zoom Meeting" };
    }
  }
};

export const getZoomMeetingDetails = async (meetingId: string): Promise<any> => {
  const token = await getZoomBearerToken();
  const response = await fetch(`${process.env.ZOOM_API_URL}/meetings/${meetingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.access_token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  const error = await response.json();
  console.log("Error fetching Zoom meeting details:", error);
  throw { status: response.status, message: error.message || "Error fetching Zoom meeting details" };
};

export const deleteZoomMeeting = async (zoomId: string): Promise<void> => {
  const token = await getZoomBearerToken();

  if (!zoomId) {
    throw new Error("Zoom ID is required to delete a meeting");
  }

  try {
    const response = await axios.delete(
      `${process.env.ZOOM_API_URL}/meetings/${zoomId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.access_token}`
        },
      }
    );

    if (response.status !== 204) {
      throw new Error(`Failed to delete Zoom meeting. Status code: ${response.status}`);
    }

    console.log("Zoom meeting deleted successfully");
  } catch (error) {
    console.error("Error deleting Zoom meeting: ", error);
    throw new Error("Failed to delete Zoom meeting");
  }
};
