import { readFile } from "fs/promises";
import path from "path";
import ProfileContent from "./ProfileContent";

async function loadProfileMarkdown(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "profile.md");
  return readFile(filePath, "utf-8");
}

export default async function ProfilePage() {
  let markdown = "";
  let loadError: string | null = null;

  try {
    markdown = await loadProfileMarkdown();
  } catch {
    loadError = "Failed to load profile markdown.";
  }

  return (
    <main className="theme-page min-vh-100 py-4">
      <section className="container">
        <ProfileContent markdown={markdown} loadError={loadError} />
      </section>
    </main>
  );
}
