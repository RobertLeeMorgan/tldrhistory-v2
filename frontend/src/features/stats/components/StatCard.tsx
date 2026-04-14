import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  value?: string | number;
  description?: string;
  imageSrc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  isNotFound?: boolean;
};

export default function StatCard({
  title,
  value,
  description,
  imageSrc,
  icon: Icon,
  isLoading = false,
  isNotFound = false,
}: StatCardProps) {
  return (
    <div className="stat lg:gap-2 space-y-1 p-3 xs:px-5 sm:px-4 lg:px-6 items-start sm:items-center">
      {(imageSrc || Icon) && (
        <div className="stat-figure text-gold/95 hidden sm:block">
          {imageSrc ? (
            <div className="avatar">
              <div className="w-8 md:w-10 lg:w-16">
                <motion.img
                  key={imageSrc}
                  src={imageSrc}
                  alt={title}
                  className="absolute w-full h-full object-cover rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ) : Icon ? (
            <Icon className="w-8 md:w-10 lg:w-16 h-auto" />
          ) : null}
        </div>
      )}

      <div className="stat-title text-stone-400 truncate self-end md:text-base">
        {title}
      </div>

      <div className="text-gold/95 truncate font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg m-auto"></span>
        ) : isNotFound ? (
          "—"
        ) : (
          (value ?? "—")
        )}
      </div>

      {description && (
        <div className="stat-desc truncate self-start text-stone-400/60 md:text-base">
          {description}
        </div>
      )}
    </div>
  );
}
