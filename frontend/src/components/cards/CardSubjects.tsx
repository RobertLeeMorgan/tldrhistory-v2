import {
  FaCoins, FaGavel, FaPalette, FaScroll, FaTheaterMasks, FaTree
} from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { GiSailboat } from "react-icons/gi";
import { MdOutlineScience } from "react-icons/md";

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  art: FaPalette,
  military: LuSwords,
  politics: FaGavel,
  economic: FaCoins,
  culture: FaTheaterMasks,
  religion: FaScroll,
  maritime: GiSailboat,
  environment: FaTree,
  intellectual: MdOutlineScience,
};

export default function CardSubjects({ subjects }: { subjects: any[] }) {
  return (
    <div className="items-center flex flex-wrap gap-2 text-primary items-center">
      {subjects.map((s) => {
        const Icon = SUBJECT_ICONS[s.name];
        return (
          <span
            key={s.id}
            className="badge bg-primary border border-sky-800 flex items-center gap-1 shadow-sm shadow-black/30 text-shadow-sm"
          >
            {Icon && <Icon className="w-4 h-4" />} {s.name}
          </span>
        );
      })}
    </div>
  );
}
