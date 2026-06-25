import { useState, useEffect, useCallback } from "react";
import { useAuth } from "~/modules/authentication";
import { Link, useNavigate } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { LearnNavbar } from "~/hsk/components/navbar";
import type { HskWord } from "~/hsk/hooks/use-hsk";

type WordForm = {
  chinese: string;
  pinyin: string;
  english: string;
  hskLevel: number;
  exampleSentence: string;
  examplePinyin: string;
  exampleEnglish: string;
};

const emptyForm: WordForm = {
  chinese: "",
  pinyin: "",
  english: "",
  hskLevel: 1,
  exampleSentence: "",
  examplePinyin: "",
  exampleEnglish: "",
};

export default function AdminHskPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { config } = useConfigurables();

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [words, setWords] = useState<HskWord[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WordForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hskLevels = config?.hskLevels ?? [];

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchWords = useCallback(async () => {
    setLoadingWords(true);
    try {
      const res = await fetch(`/api/admin/hsk/words/${selectedLevel}?limit=100`);
      const json = await res.json();
      if (json.success) setWords(json.data.words ?? []);
    } catch {
      setError("Failed to load words");
    } finally {
      setLoadingWords(false);
    }
  }, [selectedLevel]);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const url = editingId
        ? `/api/admin/hsk/words/${editingId}`
        : "/api/admin/hsk/words";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(editingId ? "Word updated!" : "Word added!");
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        await fetchWords();
      } else {
        setError(json.message ?? "Failed to save");
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (word: HskWord) => {
    setForm({
      chinese: word.chinese,
      pinyin: word.pinyin,
      english: word.english,
      hskLevel: word.hskLevel,
      exampleSentence: word.exampleSentence ?? "",
      examplePinyin: word.examplePinyin ?? "",
      exampleEnglish: word.exampleEnglish ?? "",
    });
    setEditingId(word._id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this word?")) return;
    try {
      const res = await fetch(`/api/admin/hsk/words/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSuccess("Word deleted");
        await fetchWords();
      }
    } catch {
      setError("Failed to delete");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LearnNavbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
            ← Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin: HSK Word Manager</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Add, edit, and remove vocabulary for each HSK level</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm, hskLevel: selectedLevel }); setEditingId(null); setShowForm(true); setError(null); }}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            + Add Word
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
            {success}
          </div>
        )}

        {/* Level selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const label = hskLevels[lvl - 1]?.level ?? `HSK ${lvl}`;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  selectedLevel === lvl
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingId ? "Edit Word" : "Add New Word"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Chinese *</label>
                <input
                  value={form.chinese}
                  onChange={(e) => setForm((f) => ({ ...f, chinese: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. 你好"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Pinyin *</label>
                <input
                  value={form.pinyin}
                  onChange={(e) => setForm((f) => ({ ...f, pinyin: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. nǐ hǎo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">English *</label>
                <input
                  value={form.english}
                  onChange={(e) => setForm((f) => ({ ...f, english: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. hello"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">HSK Level *</label>
                <select
                  value={form.hskLevel}
                  onChange={(e) => setForm((f) => ({ ...f, hskLevel: parseInt(e.target.value, 10) }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>HSK {n}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Example Sentence (Chinese)</label>
                <input
                  value={form.exampleSentence}
                  onChange={(e) => setForm((f) => ({ ...f, exampleSentence: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. 你好，我是学生。"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Example Pinyin</label>
                <input
                  value={form.examplePinyin}
                  onChange={(e) => setForm((f) => ({ ...f, examplePinyin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Nǐ hǎo, wǒ shì xuésheng."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Example English</label>
                <input
                  value={form.exampleEnglish}
                  onChange={(e) => setForm((f) => ({ ...f, exampleEnglish: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Hello, I am a student."
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                  className="px-5 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Word" : "Add Word"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Words table */}
        {loadingWords ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-foreground">
                {hskLevels[selectedLevel - 1]?.level ?? `HSK ${selectedLevel}`} Vocabulary
              </h2>
              <span className="text-xs text-muted-foreground">{words.length} words</span>
            </div>
            {words.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No words found for this level. Add some!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Chinese</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Pinyin</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">English</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Example</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map((word, i) => (
                      <tr key={word._id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 font-bold text-foreground text-lg">{word.chinese}</td>
                        <td className="px-4 py-3 text-muted-foreground">{word.pinyin}</td>
                        <td className="px-4 py-3 text-foreground">{word.english}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell max-w-xs truncate">
                          {word.exampleSentence ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(word)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors text-foreground"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(word._id)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
