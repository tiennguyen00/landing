export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-parkinsans bg-white dark:bg-black">{children}</main>
  );
}
