import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { SubmitModalProps } from "@utils/types";
import ZoomIntro from "./ZoomIntro";
import ZoomSetUp from "./ZoomSetUp";
import ZoomSent from "./ZoomSent";
import HostModal from "./HostModal";
import { profileModalStyle } from "@utils/style-helpers";
import useSWR from "swr";
import { USER_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";

export default function SubmitModal({ open, numSteps, onClose, onNextClick, isLoading, setIsLoading, step, userId }: SubmitModalProps) {
  const { data: user, error: userError } = useSWR(userId ? `${USER_ENDPOINT}/${userId}` : null, fetchGetJSON);

  return (
    <Modal
      open={step < numSteps && open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={profileModalStyle(step === 3 ? "464px" : "720px")}>
        {step === 0 && <ZoomIntro close={onClose} nextClicked={onNextClick} />}
        {step === 1 && <ZoomSetUp close={onClose} nextClicked={onNextClick} />}
        {step === 2 && <ZoomSent close={onClose} />}
        {step === 3 && <HostModal user={user} nextClicked={onNextClick} userId={userId} isLoading={isLoading} setIsLoading={setIsLoading} />}
      </Box>
    </Modal>
  );
}
