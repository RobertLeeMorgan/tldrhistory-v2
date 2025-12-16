import { formatDate } from "../../utils/formatDate";
import type { Post } from "../../generated/graphql";
import CardSubjects from "../cards/CardSubjects";

export default function ModalHeader({ post }: { post: Post }) {
  const start = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay)
  );

  const end = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay)
  );

  const hasImage = Boolean(post.imageUrl);

  return (
    <div className="p-4">
      <h2 className="card-title text-slate-300 text-xl sm:text-2xl mb-2 md:mb-4">
        {post.name}
      </h2>
      <div
        className={`grid ${
          hasImage ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        } gap-4`}
      >
        {hasImage && (
          <div className="relative max-w-300 mx-auto h-full rounded">
            <a
              href={post.sourceUrl ? post.sourceUrl : ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={post.imageUrl ? post.imageUrl : ""}
                alt={post.name}
                style={{ maxHeight: "10rem" }}
                className="h-full object-cover justify-self-center rounded"
                loading="lazy"
              />
            </a>

            {post.imageCredit && (
              <p className="text-[10px] bg-black text-slate-400 pl-2 italic">
                Image credit:{" "}
                <a
                  href={post.sourceUrl ? post.sourceUrl : ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-300 truncate"
                >
                  {post.imageCredit}
                </a>
              </p>
            )}
          </div>
        )}

        <div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-slate-300 text-md sm:text-lg pt-2">
            {post.type === "person" ? (
              <>
                <span className="font-semibold">Born:</span>
                <span>{start}</span>

                {end && end !== "0 CE" && (
                  <>
                    <span className="font-semibold">Died:</span>
                    <span>{end}</span>
                  </>
                )}

                <span className="font-semibold">Locale:</span>
                <span>{post.country.name}</span>

                <span className="font-semibold">Group:</span>
                <span>{post.group?.name}</span>
              </>
            ) : (
              <>
                <span className="font-semibold">From:</span>
                <span>{start}</span>

                {end && end !== "0 CE" && (
                  <>
                    <span className="font-semibold">To:</span>
                    <span>{end}</span>
                  </>
                )}

                <span className="font-semibold">Locale: </span>
                <span>{post.country.name}</span>

                {post.group?.name && (
                  <>
                    <span className="font-semibold">Group:</span>
                    <span>{post.group?.name}</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="mt-4 items-start">
            <CardSubjects subjects={post.subjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
