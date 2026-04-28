import HeaderContainer from "../../../components/ui/HeaderContainer";
import { MdVerifiedUser } from "react-icons/md";

type HeaderProps = {
  memberSince?: String;
  user?: String;
  isLoading: boolean;
  verified?: String | null;
};

export default function UserHeader({
  memberSince,
  user,
  isLoading,
  verified,
}: HeaderProps) {
  const isNotFound = !isLoading && !user;

  return (
    <HeaderContainer>
      <div className="relative z-10 h-full flex flex-col justify-center sm:py-6.5 text-center">
        {/* Title */}
        <h1 className="font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase text-stone-100 text-shadow-lg">
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : isNotFound ? (
            "User Not Found"
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>{user}</span>
              {verified && <sup className="text-xs sm:text-sm md:text-md lg:text-lg text-gold"><MdVerifiedUser /></sup>}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        {!isNotFound && (
          <h2 className="text-xs sm:text-md md:text-lg text-stone-200/90 mt-1 uppercase font-serif ">
            {isLoading ? "—" : `— Since ${memberSince} —`}
          </h2>
        )}
      </div>
    </HeaderContainer>
  );
}
