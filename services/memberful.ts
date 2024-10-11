import { MemberInfo, MemberInfoByEmail, MemberErrorByEmail } from "@utils/types";
import fetch from "node-fetch";
import axios from "axios";


const url = process.env.NEXT_PUBLIC_MEMBERFUL_URL + "/api/graphql";
const bearer = "Bearer " + process.env.MEMBERFUL_API_KEY;

export const createMemberfulUser = async (email: string, fullName: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: JSON.stringify({
      query: `mutation {
        memberCreate(email: "${email}", fullName: "${fullName}") {
          member {
            id
            username
          }
        }
      }`,
    }),
  });

  if (response.ok) return response.json();
  throw { status: response.status, message: "Error creating member" };
};

export const getMemberfulUserInfoByEmail = async (email: string): Promise<MemberInfoByEmail | MemberErrorByEmail> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: JSON.stringify({
      query: `{
        memberByEmail(email: "${email}") {
          id
          email
          fullName
        }
      }`,
    }),
  });

  if (response.ok) {
    const data: any = await response.json();
    return data;
  }
  throw { status: response.status, message: "Error fetching member info" };
};

export const getMemberfulUserInfo = async (id: string): Promise<MemberInfo | undefined> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: JSON.stringify({
      query: `query {
        member(id: ${id}) {
          id
          fullName
          email
          subscriptions {
            id
            plan {
              id
              name
            }
          }
          metadata
        }
      }`,
    }),
  });

  // Need test with prod memberfull
  // if (response.ok) return response.json();
  // throw { status: response.status, message: 'Error fetching member info' };

  if (response.ok) {
    const data: any = await response.json();
    // console.log('Full Response Data:', data);
    if (data.errors) {
      console.error("Errors:", data.errors);
      throw new Error("Error in API response");
    }
    return data;
  } else {
    console.error("Response error:", response.status, response.statusText);
    throw { status: response.status, message: "Error fetching member info" };
  }
};

export const deleteMemberfulUser = async (id: string): Promise<any> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: JSON.stringify({
      query: `mutation memberDelete($id: ID!) {
          memberDelete(id: $id) {
            id
          }
        }`,
      variables: { "id": id },
    }),
  });

  if (response.ok) return response.json();
  throw { status: response.status, message: "Error deleting member" };
};


export async function refreshMemberfulToken(refreshToken: string) {
  const response = await fetch("https://testii.memberful.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.MEMBERFUL_CLIENT_ID as string,
      client_secret: process.env.MEMBERFUL_CLIENT_SECRET as string,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data;
}

export const addSubscriptionToMember = async (memberId: string, planId: string): Promise<any> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: JSON.stringify({
      query: `mutation {
        subscriptionCreate(memberId: "${memberId}", planId: "${planId}") {
          subscription {
            id
            plan {
              id
              name
            }
          }
        }
      }`,
    }),
  });

  if (response.ok) return response.json();
  throw { status: response.status, message: "Error adding subscription" };
};

export const updateMemberInfo = async (id: string, fullName: string) => {
  const query = `
    mutation UpdateMember($id: ID!, $fullName: String) {
      memberUpdate(
        id: $id
        fullName: $fullName
      ) {
        member {
          id
          fullName
        }
      }
    }
  `;

  const variables = {
    id,
    fullName,
  };

  try {
    await axios.post(
      `${url}`,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error("Failed to update Memberful user");
  }
};
