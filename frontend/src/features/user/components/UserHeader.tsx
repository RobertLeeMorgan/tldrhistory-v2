import { MdVerifiedUser } from "react-icons/md";

type HeaderProps = {
  memberSince?: string;
  user?: string;
  isLoading: boolean;
  verified?: string | null;
};

export default function UserHeader({ memberSince, user, isLoading, verified }: HeaderProps) {
  const isNotFound = !isLoading && !user;

  return (
    <header className="border-b border-divider bg-surface px-4 py-10 text-center sm:px-6 sm:py-14">
      <p className="atlas-eyebrow">Community profile</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-content sm:text-4xl lg:text-5xl">
        {isLoading ? (
          <span className="loading loading-spinner" aria-label="Loading profile" />
        ) : isNotFound ? (
          "User not found"
        ) : (
          <span className="inline-flex items-center gap-2">
            {user}
            {verified && <span className="text-lg text-accent" title="Verified account"><MdVerifiedUser aria-label="Verified account" /></span>}
          </span>
        )}
      </h1>
      {!isNotFound && <p className="mt-3 text-sm font-semibold text-content-muted">{isLoading ? "Loading profile…" : `Member since ${memberSince}`}</p>}
    </header>
  );
}
