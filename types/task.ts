export type Task = {
  eintragID: string;
  titel: string;
  beschreibung: string;
  faelligkeit: string;
  abgeschlossen: string | null;
  created_at: string;
  updated_at: string;
  kategorie: { name: string };
  tags: { tagID: string; name: string }[];
};
