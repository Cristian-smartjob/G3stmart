import MainLayout from "@/components/layout/MainLayout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <MainLayout currentMenu="/preinvoice">
      {children}
    </MainLayout>
  )
}
