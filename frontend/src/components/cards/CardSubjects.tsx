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
  subjects: { id: string | number; name: string }[];
  modal?: boolean;
}

export default function CardSubjects({ subjects, modal }: SubjectProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {subjects.map((s) => {
        const Icon = SUBJECT_ICONS[s.name];
        return (
          <span
            key={s.id}
            className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize tracking-wide ${modal ? "border-accent/45 bg-accent/12 text-accent" : "border-divider bg-canvas/45 text-content-muted"}`}
          >
            {Icon && <Icon className="w-4 h-4" />} {s.name}
          </span>
        );
      })}
    </div>
  );
}
