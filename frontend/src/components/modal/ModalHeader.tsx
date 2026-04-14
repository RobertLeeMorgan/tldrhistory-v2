import { formatDate } from "../../utils/formatDate";
import type { Post } from "../../generated/graphql";
import CardSubjects from "../cards/CardSubjects";

export default function ModalHeader({ post }: { post: Post }) {
  const start = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay),
  );

  const end = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay),
  );

  const imageSrc = post.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post.imageUrl;

  return (
    <div
      className={`grid ${
        imageSrc ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      } gap-4`}
    >
      {imageSrc && (
        <div className="relative max-w-300 mx-auto rounded">
          <a
            href={post.sourceUrl ? post.sourceUrl : ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={imageSrc ? imageSrc : ""}
              alt={post.name}
              style={{ maxHeight: "10rem" }}
              className="object-cover justify-self-center rounded"
              loading="lazy"
            />
          </a>

          {post.imageCredit && (
            <div className="group relative justify-content-center">
              <p className="text-[10px] bg-stone-950 text-wrap text-stone-300/90 pl-2 italic line-clamp-2 break-words whitespace-normal">
                Credit:{" "}
                <a
                  href={post.sourceUrl ? post.sourceUrl : ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-stone-200"
                >
                  {post.imageCredit}
                </a>
              </p>
              <div className="pointer-events-none absolute left-0 top-full mt-1 hidden text-wrap break-words rounded bg-stone-950 px-2 py-1 text-sm text-stone-200 shadow-lg group-hover:block">
                {post.imageCredit}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-stone-300 sm:text-lg">
          {post.type === "person" ? (
            <>
              <span className="font-semibold text-stone-400">Born:</span>
              <span>{start}</span>

              {end && end !== "0 CE" && (
                <>
                  <span className="font-semibold text-stone-400">Died:</span>
                  <span>{end}</span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="font-semibold text-stone-400">From:</span>
              <span>{start}</span>

              {end && end !== "0 CE" && (
                <>
                  <span className="font-semibold text-stone-400">To:</span>
                  <span>{end}</span>
                </>
              )}
            </>
          )}
          <span className="font-semibold text-stone-400">Locale: </span>
          <span>{post.country.name}</span>

          {post.group?.name && (
            <>
              <span className="font-semibold text-stone-400">Group:</span>
              <span>{post.group?.name}</span>
            </>
          )}
        </div>
        <div className="items-start">
          <CardSubjects subjects={post.subjects} modal />
        </div>
      </div>
    </div>
  );
}
