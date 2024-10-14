/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["crypto-js", "twilio"],
  reactStrictMode: true,
  redirects: async () => {
    return [
      // For Logout we redirect to our home page
      // There is no way to distinguish a logout that was initiated from our app or directly on memberful
      // So in either case, the user will be redirected to /
      {
        source: "/api/auth/callback/Memberful",
        has: [
          {
            type: "query",
            key: "action",
            value: "logout",
          }
        ],
        destination: "/",
        permanent: false,
      },
      {
        source: "/api/auth/callback/Memberful",
        has: [
          {
            type: "query",
            key: "redirect_to"
          }
        ],
        destination: "/salons",
        permanent: false,
      },
      // There is no 'main' dashboard page 
      {
        source: "/dashboard",
        destination: "/dashboard/my-events",
        permanent: true,
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
};

module.exports = nextConfig;
