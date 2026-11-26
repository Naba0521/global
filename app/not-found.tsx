import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6">
      <div className="max-w-md">
        <p className="text-xs tracking-[0.22em] text-ember">404</p>
        <h1 className="font-display mt-4 text-4xl leading-tight">
          페이지를 찾지 못했습니다.
        </h1>
        <p className="mt-3 text-mist">This page is not on the site.</p>
        <div className="mt-8 flex gap-6 text-sm tracking-[0.16em]">
          <Link href="/ko" className="text-paper">
            한국어
          </Link>
          <Link href="/en" className="text-paper">
            English
          </Link>
        </div>
      </div>
    </main>
  );
}
