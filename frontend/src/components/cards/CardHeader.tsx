import { formatDate } from "../../utils/formatDate";
import type { Post } from "../../generated/graphql";

export default function CardHeader({ post }: { post: Post }) {
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
    <div className="z-20">
      <h2 className="card-title text-stone-200 text-xl font-bold md:text-2xl mb-2">
        {post.name}
      </h2>
        <div>
          <div className="text-stone-400 text-md sm:text-lg">
              <span>{metadata}</span>
          </div>
        </div>
    </div>
  );
}
