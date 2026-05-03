/**
 * Загрузка демо-данных в Sanity.
 * Требуется: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN (с правами записи).
 * Запуск из корня проекта: node scripts/seed.mjs
 */
import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  process.env.SANITY_STUDIO_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Укажите NEXT_PUBLIC_SANITY_PROJECT_ID (или SANITY_STUDIO_PROJECT_ID) и SANITY_API_TOKEN в окружении (см. README).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function uploadImageFromUrl(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buf, { filename });
}

async function uploadPdfAsset() {
  const res = await fetch(
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  );
  if (!res.ok) throw new Error("Не удалось загрузить демо-PDF");
  const buf = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("file", buf, {
    filename: "demo-document.pdf",
    contentType: "application/pdf",
  });
}

const block = (text) => [
  {
    _type: "block",
    _key: `b-${Math.random().toString(36).slice(2)}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text,
        _key: `s-${Math.random().toString(36).slice(2)}`,
      },
    ],
  },
];

async function main() {
  const cover1 = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1549719386-74dfcbf7a31e?w=1200&q=80",
    "news-1.jpg",
  );
  const cover2 = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1599058917765-cbdcdd8a5c0b?w=1200&q=80",
    "news-2.jpg",
  );
  const cover3 = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
    "news-3.jpg",
  );
  const hero = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80",
    "hero.jpg",
  );
  // Раздел «Сборная команда» теперь использует документы (teamDoc).
  // Спортсмены оставлены в seed для совместимости со старой схемой (можно удалить позже).
  const athPhoto = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "athlete.jpg",
  );

  const pdf = await uploadPdfAsset();

  const tx = client.transaction();

  tx.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroTitle: "Федерация бокса Югры",
    heroSubtitle:
      "Официальный ресурс: новости, календарь, сборная, документы и результаты соревнований.",
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: hero._id },
    },
    heroLinks: [
      { _type: "object", _key: "a", label: "Новости", href: "/news" },
      { _type: "object", _key: "b", label: "Календарь", href: "/calendar" },
      { _type: "object", _key: "c", label: "Сборная", href: "/team" },
    ],
    metaTitle: "Федерация бокса Югры",
    metaDescription: "Официальный сайт региональной федерации бокса Югры.",
  });

  const newsItems = [
    {
      _type: "newsArticle",
      title: "Старт регионального турнира среди юниоров",
      slug: { _type: "slug", current: "junior-tournament-start" },
      publishedAt: new Date().toISOString(),
      coverImage: { _type: "image", asset: { _type: "reference", _ref: cover1._id } },
      body: block(
        "Соревнования проходят в течение трёх дней. Участники представляют муниципальные команды Югры. Итоги будут опубликованы в разделе «Результаты».",
      ),
    },
    {
      _type: "newsArticle",
      title: "Семинар для тренеров по спортивной подготовке",
      slug: { _type: "slug", current: "coaches-seminar" },
      publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      coverImage: { _type: "image", asset: { _type: "reference", _ref: cover2._id } },
      body: block(
        "На семинаре рассмотрены вопросы безопасности, медицинского сопровождения и взаимодействия с региональными центрами.",
      ),
    },
    {
      _type: "newsArticle",
      title: "Поздравление сборной с успешным выступлением",
      slug: { _type: "slug", current: "team-success" },
      publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      coverImage: { _type: "image", asset: { _type: "reference", _ref: cover3._id } },
      body: block(
        "Федерация благодарит тренеров и спортсменов за подготовку. Продолжаем работу над усилением сборной.",
      ),
    },
  ];

  for (const n of newsItems) {
    tx.create(n);
  }

  const events = [
    {
      _type: "calendarEvent",
      competitionName: "Чемпионат ХМАО — Югры",
      eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      location: "Ханты-Мансийск, спорткомплекс",
      description: block("Отборочный этап с участием команд округов."),
      attachment: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "calendarEvent",
      competitionName: "Кубок Сургута по боксу",
      eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      location: "Сургут",
      description: block("Приглашаются спортсмены разряда не ниже первого."),
    },
    {
      _type: "calendarEvent",
      competitionName: "Учебно-тренировочные сборы",
      eventDate: new Date(Date.now() + 86400000 * 45).toISOString(),
      location: "База подготовки",
      description: block("Сборы для основного состава региональной команды."),
    },
  ];
  for (const e of events) tx.create(e);

  const athletes = [
    {
      _type: "athlete",
      fullName: "Иванов Алексей Сергеевич",
      slug: { _type: "slug", current: "ivanov-alexey" },
      photo: { _type: "image", asset: { _type: "reference", _ref: athPhoto._id } },
      weightCategory: "до 75 кг",
      birthDate: "2006-03-15",
      cityClub: "Ханты-Мансийск, СШОР",
      achievements: "Призёр первенства России среди юниоров.",
    },
    {
      _type: "athlete",
      fullName: "Петров Дмитрий Андреевич",
      slug: { _type: "slug", current: "petrov-dmitry" },
      weightCategory: "до 63,5 кг",
      ageNote: "19 лет",
      cityClub: "Сургут",
      achievements: "Чемпион окружных соревнований.",
    },
    {
      _type: "athlete",
      fullName: "Сидорова Мария Олеговна",
      slug: { _type: "slug", current: "sidorova-maria" },
      weightCategory: "до 57 кг",
      birthDate: "2007-11-02",
      cityClub: "Нижневартовск",
      achievements: "Участница всероссийских стартов.",
    },
    {
      _type: "athlete",
      fullName: "Козлов Артём Викторович",
      slug: { _type: "slug", current: "kozlov-artem" },
      weightCategory: "до 81 кг",
      birthDate: "2005-07-20",
      cityClub: "Югорск",
      achievements: "Кандидат в сборную региона.",
    },
  ];
  for (const a of athletes) tx.create(a);

  const results = [
    {
      _type: "competitionResult",
      title: "Первенство Югры среди юниоров",
      slug: { _type: "slug", current: "yugra-juniors-2025" },
      eventDate: new Date(Date.now() - 86400000 * 20).toISOString(),
      location: "Ханты-Мансийск",
      resultsText: `Соревнования прошли в полном формате по олимпийской системе.

Результаты по весам:
до 60 кг — Иванов А. (Ханты-Мансийск)
до 64 кг — Петров Д. (Сургут)

Команды:
1 место — Ханты-Мансийск
2 место — Сургут
3 место — Нижневартовск`,
      finalDocument: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "competitionResult",
      title: "Открытый турнир памяти тренеров",
      slug: { _type: "slug", current: "open-memorial-2025" },
      eventDate: new Date(Date.now() - 86400000 * 40).toISOString(),
      location: "Сургут",
      resultsText: `Традиционный турнир собрал сильнейших спортсменов региона.

Финалы во всех весовых категориях завершены.

Гран-при — Сидорова М.
Лучший боец вечера — Козлов А.`,
    },
  ];
  for (const r of results) tx.create(r);

  const regulations = [
    {
      _type: "regulationDoc",
      title: "Положение о чемпионате ХМАО — Югры",
      slug: { _type: "slug", current: "reg-championship-hmao" },
      docDate: new Date().toISOString().slice(0, 10),
      shortDescription: "Регламент проведения официального чемпионата округа.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "regulationDoc",
      title: "Требования к допуску спортсменов",
      slug: { _type: "slug", current: "reg-admission" },
      docDate: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
      shortDescription: "Медицинский допуск и разряд.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "regulationDoc",
      title: "Судейская коллегия — состав",
      slug: { _type: "slug", current: "reg-judges" },
      docDate: new Date(Date.now() - 86400000 * 12).toISOString().slice(0, 10),
      shortDescription: "Утверждённый перечень судей на сезон.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
  ];
  for (const r of regulations) tx.create(r);

  const reports = [
    {
      _type: "reportDoc",
      title: "Отчёт о турнире в Ханты-Мансийске",
      slug: { _type: "slug", current: "report-khanty-tournament" },
      docDate: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
      shortDescription: "Статистика боёв и количество участников.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "reportDoc",
      title: "Итоги отборочного этапа",
      slug: { _type: "slug", current: "report-qualifier" },
      docDate: new Date(Date.now() - 86400000 * 18).toISOString().slice(0, 10),
      shortDescription: "Списки прошедших в следующий раунд.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
  ];
  for (const r of reports) tx.create(r);

  const calls = [
    {
      _type: "callDoc",
      title: "Вызов на сборы сборной Югры",
      slug: { _type: "slug", current: "call-team-camp" },
      docDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      description:
        "Приглашаются спортсмены основного состава. Место и время сбора уточняются у тренерского штаба.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
    {
      _type: "callDoc",
      title: "Вызов судей на соревнования",
      slug: { _type: "slug", current: "call-judges" },
      docDate: new Date().toISOString().slice(0, 10),
      description: "Прошу подтвердить участие в судействе не позднее чем за 5 дней.",
      file: { _type: "file", asset: { _type: "reference", _ref: pdf._id } },
    },
  ];
  for (const c of calls) tx.create(c);

  await tx.commit();
  console.log("Демо-данные успешно загружены.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
