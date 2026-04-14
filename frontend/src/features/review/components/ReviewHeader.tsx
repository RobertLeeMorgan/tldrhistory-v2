import HeaderContainer from "../../../components/ui/HeaderContainer";

export default function ReviewHeader() {
  return (
    <HeaderContainer>
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center sm:py-6.5 text-center">
        {/* Title */}
        <h2 className="font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase text-stone-100 text-shadow-lg">
          Review Suggestions
        </h2>
      </div>
    </HeaderContainer>
  );
}
