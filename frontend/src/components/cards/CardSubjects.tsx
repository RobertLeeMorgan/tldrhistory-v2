import {
  FaCoins,
  FaGavel,
  FaPalette,
  FaScroll,
  FaTheaterMasks,
  FaTree,
} from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { GiSailboat } from "react-icons/gi";
import { MdOutlineScience } from "react-icons/md";

const SUBJECT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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

type SubjectProps = {
  subjects: any[];
  modal?: boolean
}

export default function CardSubjects({ subjects, modal }: SubjectProps) {
  return (
    <div className="items-center flex flex-wrap gap-2 items-center">
      {subjects.map((s) => {
        const Icon = SUBJECT_ICONS[s.name];
        return (
          <span
            key={s.id}
            className={`badge ${modal ? "bg-gold/90" : "bg-stone-800/60"} border border-stone-800 flex items-center text-sm gap-1 shadow-sm shadow-stone-950/30 text-stone-200 p-3`}
          >
            {Icon && <Icon className="w-4 h-4" />} {s.name}
          </span>
        );
      })}
    </div>
  );
}