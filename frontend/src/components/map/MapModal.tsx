import ModalCloseButton from "../modal/ModalCloseButton";
import WorldMap from "./WorldMap";
import ModalShell from "../modal/ModalShell";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  civilisations: {
    id: string;
    name: string;
    country: { name: string; continent: string };
    startYear: number;
    endYear: number;
    startSignificance: number;
    group?: { id: number } | null;
  }[];
  onClick?: () => void;
  isInteractive?: boolean;
}

export default function MapModal({ open, onClose, civilisations }: ModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      panelClassName="max-w-5xl p-1 sm:p-3"
    >
      <ModalCloseButton onClose={onClose} />
      <div className="aspect-[16/9] w-full mx-auto">
        <WorldMap civilisations={civilisations} isInteractive={true} />
      </div>
    </ModalShell>
  );
}
