import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-accent-muted">404</p>
      <h1 className="mt-4 text-3xl font-bold text-white">Страница не найдена</h1>
      <p className="mt-3 text-zinc-400">Проверьте адрес или вернитесь на главную.</p>
      <Link
        href="/"
        className="btn-primary mt-8 rounded-xl px-6 py-3 text-sm font-semibold text-white transition"
      >
        На главную
      </Link>
    </div>
  );
}
