// import GradientButton from "@components/Common/CustomButton";
// import { EventCategories, EventNames } from "@config";
// import { logEvent } from "@utils/analytics";
// import { signIn } from "next-auth/react";

// export default function SignInButton({ email, callbackUrl, text }: { email: string, callbackUrl: string, text: string }) {
  
//   const handleSignInClick = () => {
//     logEvent(EventCategories.USER_ACTION, EventNames.SEND_MAGIC_LINK_CLICKED);
//   };

//   const handleClick = () => {
//     handleSignInClick();
//     signIn("email", { email, callbackUrl: callbackUrl });
//   };

//   return (
//     <GradientButton fullWidth variant="contained"
//       onClick={handleClick}
//     >
//       {text}
//     </GradientButton>
//   );
// }

import GradientButton from "@components/Common/CustomButton";
import { EventCategories, EventNames } from "@config";
import { logEvent } from "@utils/analytics";
import { signIn } from "next-auth/react";
import PhoneLoginButton from "./PhoneLoginButton";

export default function SignInButton({ email, callbackUrl, text }: { email: string, callbackUrl: string, text: string }) {
  
  const handleSignInClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.SEND_MAGIC_LINK_CLICKED);
  };

  const handleClick = () => {
    handleSignInClick();
    signIn("email", { email, callbackUrl: callbackUrl });
  };

  return (
    <div>
      <GradientButton fullWidth variant="contained"
        onClick={handleClick}
      >
        {text}
      </GradientButton>
      <PhoneLoginButton callbackUrl={callbackUrl} />
    </div>
  );
}
