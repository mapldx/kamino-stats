import Banner from "./banner"

const navigation = [
  { name: 'Protocol', href: '/' },
  { name: 'Pools', href: '/pools' },
  { name: 'Portfolio', href: '/portfolio' },
]

export default function Example() {

  return (
    <div>
      <Banner />
      <header className="bg-kamino-bg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src="https://app.kamino.finance/assets/logo.8c6a15ef.svg" alt="" />
            </a>
          </div>
          <div className="flex gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex flex-1 justify-end">
            <a href="https://app.kamino.finance/" className="text-sm font-semibold leading-6 text-white">
              Launch Kamino <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  )
}
