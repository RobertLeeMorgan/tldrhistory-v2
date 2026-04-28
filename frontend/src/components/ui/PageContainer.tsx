import { motion } from "framer-motion";

type PageProps = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: PageProps) {
  return (
    <motion.div
      className="flex flex-col min-h-screen items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
