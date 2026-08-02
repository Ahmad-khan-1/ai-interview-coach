export function chunkText(text) {
  const chunks = [];

  const headingPattern =
    /\n(?=(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|SUMMARY|OBJECTIVE|CERTIFICATIONS|ACHIEVEMENTS)\b)/gi;

  const sections = text
    .split(headingPattern)
    .filter((s) => s.trim().length > 0);

  if (sections.length > 1) {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (section.length > 20) {
        chunks.push(section);
      }
    }
  } else {
    const chunkSize = 500;
    const overlap = 50;
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunk = text.slice(i, i + chunkSize).trim();
      if (chunk.length > 20) {
        chunks.push(chunk);
      }
    }
  }

  return chunks;
}
