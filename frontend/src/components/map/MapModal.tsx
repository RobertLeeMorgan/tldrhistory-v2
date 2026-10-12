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
      ariaLabel="Historical map"
      panelClassName="max-w-5xl"
    >
      <div className="flex items-center justify-between border-b border-divider px-4 py-3 sm:px-5">
        <div>
          <p className="atlas-eyebrow">Geography</p>
          <h2 className="text-xl font-bold text-content sm:text-2xl">Historical map</h2>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>
      <div className="aspect-[4/3] w-full bg-canvas sm:aspect-[16/9]">
        <WorldMap civilisations={civilisations} isInteractive />
      </div>
    </ModalShell>
  );
}
