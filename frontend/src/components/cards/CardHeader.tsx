import { formatDate } from "../../utils/formatDate";
import type { Post } from "../../generated/graphql";

export default function CardHeader({ post }: { post: Post }) {
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
    <div className="p-4 z-20">
      <div
        className={`grid ${
          hasImage ? "grid-cols-[100px_1fr] xs:grid-cols-[120px_1fr]" : "grid-cols-1"
        } gap-4`}
      >
        {hasImage && (
          <div className="relative w-full h-28 overflow-hidden rounded flex items-center justify-center">
            <img
              src={post.imageUrl!}
              alt={post.name}
              className="h-full object-cover rounded"
              loading="eager"
              style={{ maxHeight: "8rem" }}
            />
          </div>
        )}

        <div>
          <h2 className="card-title text-slate-300 text-xl mb-2">
            {post.name}
          </h2>

          <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-slate-300 text-sm sm:text-md">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
