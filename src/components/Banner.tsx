export default function Banner() {
  return (
    <section className="banner">
      <img
        src="/banner.png"
        alt="The Gordo Banner"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </section>
  )
}
