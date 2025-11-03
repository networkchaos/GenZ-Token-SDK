export function TrustedBySection() {
  const companies = ["Epic Games", "Unity Studios", "Riot Games", "Supercell", "Activision", "EA Sports"]

  return (
    <section className="relative py-16 border-y border-border/40">
      <div className="container px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by game studios worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div
              key={company}
              className="text-muted-foreground/60 hover:text-foreground transition-colors font-semibold text-lg"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
