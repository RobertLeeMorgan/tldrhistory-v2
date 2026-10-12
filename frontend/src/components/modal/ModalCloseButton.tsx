import { CloseIcon } from "../../icons/icons";

export default function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      className="absolute right-3 top-3 z-50 inline-flex size-11 items-center justify-center rounded-full border border-divider bg-canvas/90 text-content-muted transition-colors hover:border-accent hover:text-accent"
      onClick={onClose}
      aria-label="Close modal"
      type="button"
    >
      <CloseIcon/>
    </button>
  );
}
