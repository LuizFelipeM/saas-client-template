export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full h-auto">{children}</main>;
}
