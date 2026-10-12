import { useState } from "react";
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
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const hasImage = Boolean(imageSrc) && imageSrc !== failedImageSrc;

  return (
    <div
      className={`grid gap-6 ${hasImage ? "md:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)]" : "grid-cols-1"}`}
    >
      {hasImage && (
        <figure className="overflow-hidden rounded-xl border border-divider bg-canvas/55">
          {post.sourceUrl ? (
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View the source image for ${post.name}`}>
              <img src={imageSrc!} alt="" className="aspect-[16/10] h-full w-full object-contain" loading="lazy" onError={() => setFailedImageSrc(imageSrc ?? null)} />
            </a>
          ) : (
            <img
              src={imageSrc!}
              alt=""
              className="aspect-[16/10] h-full w-full object-contain"
              loading="lazy"
              onError={() => setFailedImageSrc(imageSrc ?? null)}
            />
          )}
          {post.imageCredit && <figcaption className="border-t border-divider px-3 py-2 text-xs italic leading-5 text-content-muted">
            Credit: {post.sourceUrl ? (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words underline decoration-control underline-offset-2 hover:text-content"
                >
                  {post.imageCredit}
                </a>
            ) : post.imageCredit}
          </figcaption>}
        </figure>
      )}

      <div className="space-y-5">
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 rounded-xl border border-divider bg-canvas/35 p-4 text-sm text-content sm:text-base">
          {post.type === "person" ? (
            <>
              <dt className="font-bold text-content-muted">Born</dt>
              <dd>{start}</dd>

              {end && end !== "0 CE" && (
                <>
                  <dt className="font-bold text-content-muted">Died</dt>
                  <dd>{end}</dd>
                </>
              )}
            </>
          ) : (
            <>
              <dt className="font-bold text-content-muted">From</dt>
              <dd>{start}</dd>

              {end && end !== "0 CE" && (
                <>
                  <dt className="font-bold text-content-muted">To</dt>
                  <dd>{end}</dd>
                </>
              )}
            </>
          )}
          <dt className="font-bold text-content-muted">Locale</dt>
          <dd>{post.country.name}</dd>

          {post.group?.name && (
            <>
              <dt className="font-bold text-content-muted">Group</dt>
              <dd>{post.group.name}</dd>
            </>
          )}
        </dl>
        <div>
          <CardSubjects subjects={post.subjects} modal />
        </div>
      </div>
    </div>
  );
}
