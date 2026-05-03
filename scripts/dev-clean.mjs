/**
 * "Чистый запуск" для локальной разработки на macOS:
 * - освобождает порт 3000 (если занят),
 * - удаляет .next (битый кэш часто ломает dev),
 * - запускает Next строго на http://localhost:3000
 */
import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const PORT = Number(process.env.PORT || 3000);

function run(cmd, args, { stdio = "pipe" } = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio });
    let out = "";
    let err = "";
    if (child.stdout) child.stdout.on("data", (d) => (out += String(d)));
    if (child.stderr) child.stderr.on("data", (d) => (err += String(d)));
    child.on("close", (code) => resolve({ code: code ?? 0, out, err }));
  });
}

async function killPort3000() {
  // macOS: lsof обычно доступен по умолчанию
  const { code, out } = await run("lsof", ["-ti", `tcp:${PORT}`], { stdio: "pipe" });
  if (code !== 0) return;
  const pids = out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));

  for (const pid of pids) {
    // мягко
    await run("kill", ["-15", String(pid)], { stdio: "ignore" });
  }
  // небольшой таймаут, чтобы процесс успел закрыть порт
  await new Promise((r) => setTimeout(r, 350));

  // если всё ещё висит — добиваем
  const again = await run("lsof", ["-ti", `tcp:${PORT}`], { stdio: "pipe" });
  const pids2 = again.out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const pid of pids2) {
    await run("kill", ["-9", String(pid)], { stdio: "ignore" });
  }
}

async function removeNextCache() {
  await rm(new URL("../.next", import.meta.url), { recursive: true, force: true });
}

async function main() {
  await killPort3000();
  await removeNextCache();

  const devCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const devArgs = [
    "run",
    "dev",
    "--",
    "--webpack",
    "-p",
    String(PORT),
    "-H",
    "localhost",
  ];

  console.log(`\n[dev:clean] Running: ${devCommand} ${devArgs.join(" ")}\n`);

  const child = spawn(
    devCommand,
    devArgs,
    { stdio: "inherit" },
  );
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

