import { formatDate } from "../../utils/formatDate";
import type { Post } from "../../generated/graphql";

export default function CardHeader({ post, onOpen }: { post: Post; onOpen?: () => void }) {
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

  const metadata = `${start}${end && end !== "0 CE" ? ` - ${end}` : ""}, ${post.country.name}`;

  return (
    <header className="relative z-20 space-y-2">
      <h2 className="text-xl font-bold leading-tight text-content md:text-2xl">
        {onOpen ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="text-left decoration-accent decoration-2 underline-offset-4 hover:text-accent hover:underline"
            aria-label={`Read ${post.name}`}
          >
            {post.name}
          </button>
        ) : post.name}
      </h2>
      <p className="text-sm font-medium leading-6 text-content-muted sm:text-base">{metadata}</p>
    </header>
  );
}
