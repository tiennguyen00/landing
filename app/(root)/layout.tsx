export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-parkinsans bg-white dark:bg-black overflow-x-hidden">
      {children}
    </main>
  );
}
