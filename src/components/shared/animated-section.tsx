export default function AnimatedSection({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${delay}ms`, animationDuration: "350ms" }}
    >
      {children}
    </div>
  )
}