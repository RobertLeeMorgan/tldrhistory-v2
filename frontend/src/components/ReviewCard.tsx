import type { Post } from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
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

interface ArticleCardProps {
  post: Post;
}

const SUBJECT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  art: FaPalette,
  military: LuSwords,
  politics: FaGavel,
  economics: FaCoins,
  culture: FaTheaterMasks,
  religion: FaScroll,
  maritime: GiSailboat,
  environment: FaTree,
  intellectual: MdOutlineScience,
};

export default function ArticleCard({ post }: ArticleCardProps) {
  const start = formatDate(post.startYear, post.startMonth, post.startDay);
  const end = formatDate(post.endYear, post.endMonth, post.endDay);
  const hasImage = Boolean(post.imageUrl);

  return (
    <article className="w-full card bg-base-100 shadow-xl">
      {/* HEADER */}
      <div
        className={`grid ${
          hasImage ? "grid-cols-[120px_1fr]" : "grid-cols-1"
        } gap-4 p-4`}
      >
        {hasImage && (
          <div className="relative w-full h-full flex items-start justify-center overflow-hidden rounded">
            <img
              src={post.imageUrl!}
              alt={post.name}
              className="w-full h-full object-cover object-center"
              style={{ maxHeight: "7.5rem" }}
            />
          </div>
        )}

        {/* Right header content */}
        <div className="flex flex-col justify-start">
          <h2 className="card-title text-slate-300 text-xl mb-2">
            {post.name}
          </h2>
          <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-slate-300">
            {post.type === "person" ? (
              <>
                <span className="font-semibold">Type:</span>
                <span>{post.type}</span>
                <span className="font-semibold">Born:</span>
                <span>{start}</span>
                {end && end !== "0 CE" && (
                  <>
                    <span className="font-semibold">Died:</span>
                    <span>{end}</span>
                  </>
                )}
                <span className="font-semibold">Place:</span>
                <span>{post.country.name}</span>
              </>
            ) : (
              <>
                <span className="font-semibold">Type:</span>
                <span>{post.type}</span>
                <span className="font-semibold">Start:</span>
                <span>{start}</span>
                {end && end !== "0 CE" && (
                  <>
                    <span className="font-semibold">End:</span>
                    <span>{end}</span>
                  </>
                )}
                <span className="font-semibold">Place:</span>
                <span>{post.country.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="px-4 pb-4">
        <p className="text-base md:text-lg text-slate-300 mb-2">
          {post.startDescription}
        </p>
        {post.endDescription && (
          <p className="italic text-sm text-slate-400">{post.endDescription}</p>
        )}
        <p className="text-base md:text-lg text-slate-300 my-2">{post.sourceUrl}</p>
        {/* Subjects */}
        <div className="mt-3 flex flex-wrap gap-2 text-primary">
          {post.subjects.map((s) => {
            const Icon = SUBJECT_ICONS[s.name];
            return (
              <span
                key={s.id}
                className="badge badge-secondary flex items-center gap-1"
              >
                {Icon && <Icon className="w-4 h-4" />} {s.name}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}
