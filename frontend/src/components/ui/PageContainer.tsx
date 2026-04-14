import Background from "./Background";

type PageProps = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center overflow-hidden">
      <Background />
       {children}
    </div>
  );
}