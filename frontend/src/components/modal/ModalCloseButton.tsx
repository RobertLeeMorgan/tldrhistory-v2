import { CloseIcon } from "../../icons/icons";

export default function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      className="absolute top-4 right-4 text-stone-500 hover:text-gold text-xl z-50"
      onClick={onClose}
      aria-label="Close modal"
      type="button"
    >
      <CloseIcon/>
    </button>
  );
}