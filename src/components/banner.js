export default function Banner() {
  return (
    <div className="flex items-center gap-x-6 bg-opos-bg px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <a href="https://www.cubik.so/project/80aa8a10-a639-44e8-b946-388d1e96372b/hackathon/8e23ade0-0dae-4c4b-83aa-67867749029c" target="_blank">
          <strong className="font-semibold">Kamino One is a submission to LamportDAO&apos;s #OPOSHackathon</strong>
          <span className="px-2">•</span>
          beta.kamino.one is temporarily optimized for the hackathon. As such, data is set to only refresh every 24h. View submission on Cubik&nbsp;<span aria-hidden="true">&rarr;</span>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
        </button>
      </div>
    </div>
  )
}