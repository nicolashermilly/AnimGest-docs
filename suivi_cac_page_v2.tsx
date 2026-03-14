"use client";
// src/app/app/seances/[id]/suivi-cac/page.tsx
// URLS API : /api/ged-cac/* et /api/ged-libelles-ec
// _h56.use() + prefixes /ged-* pour contourner filtre 404 NestJS

import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type CacData = Record<string, any>;
type Libelle = { PLE_CODE: string; PLE_LIBELLE: string };

const gedApi = {
  get: (path: string) => fetch(`/api${path}`, { credentials: 'include' }).then(r => r.json()),
  post: (path: string, body: any) => fetch(`/api${path}`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json()),
};

export default function SuiviCacPage() {
  const { id: sea_id } = useParams<{ id: string }>();

  const [seance, setSeance] = useState<any>(null);
  const [cac, setCac] = useState<CacData>({});
  const [prevCac, setPrevCac] = useState<CacData | null>(null);
  const [libelles, setLibelles] = useState<Libelle[]>([]);
  const [source, setSource] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/seances/${sea_id}`).then(r => r.json()),
      gedApi.get(`/ged-cac/${sea_id}`).catch(() => null),
      gedApi.get(`/ged-cac/${sea_id}/initial`).catch(() => null),
      gedApi.get(`/ged-libelles-ec?groupe=CAC`).catch(() => []),
    ]).then(([sea, existing, initial, libs]) => {
      setSeance(sea);
      setLibelles(Array.isArray(libs) ? libs : []);
      if (existing) {
        setCac(existing);
        setSource("existant");
      } else if (initial) {
        const d = initial.data || {};
        setCac(d);
        setPrevCac(d);
        setSource(
          initial.source === "SEANCE" ? "Séance précédente" :
          initial.source === "EC" ? "Étude Comportementale" : ""
        );
      }
    }).finally(() => setLoading(false));
  }, [sea_id]);

  function setField(field: string, value: any) {
    setCac(prev => ({ ...prev, [field]: value }));
  }

  const score = Array.from({ length: 14 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return cac[`SSC_CAC_${n}`] === 1 || cac[`SSC_CAC_${n}`] === true ? 1 : 0;
  }).reduce((a, b) => a + b, 0);

  const prevScore = prevCac ? Array.from({ length: 14 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return prevCac[`SSC_CAC_${n}`] === 1 ? 1 : 0;
  }).reduce((a, b) => a + b, 0) : null;

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...cac };
      for (let i = 1; i <= 14; i++) {
        const n = String(i).padStart(2, "0");
        if (payload[`SSC_CAC_${n}`] === undefined) payload[`SSC_CAC_${n}`] = 0;
      }
      await gedApi.post(`/ged-cac/${sea_id}`, payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-slate-400 animate-pulse">Chargement…</div>
    </div>
  );

  const isRealise = seance?.SST_CODE === "REALISEE";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi CAC"
        subtitle={seance ? `${seance.CLIENT_NOM || ""} — ${seance.ANI_NOM || ""}` : `Séance #${sea_id}`}
        helpAnchor="#suivi-cac"
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/app/seances/${sea_id}`} className="btn-ghost text-sm">← Séance</Link>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              {saving ? "Sauvegarde…" : saved ? "✓ Sauvé" : "Enregistrer"}
            </button>
          </div>
        }
      />

      {/* Score + source */}
      <div className="flex flex-wrap gap-4">
        <div className="card p-4 flex items-center gap-4 flex-1 min-w-48">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{score}</div>
            <div className="text-xs text-slate-400">/ 14 critères</div>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(score / 14) * 100}%` }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">{Math.round((score / 14) * 100)}% acquis</div>
            {prevScore !== null && (
              <div className={`text-xs mt-0.5 font-medium
                  ${score > prevScore ? "text-green-400" : score < prevScore ? "text-red-400" : "text-slate-400"}`}>
                {score > prevScore ? `↑ +${score - prevScore}` : score < prevScore ? `↓ ${score - prevScore}` : "= Stable"} vs séance précédente
              </div>
            )}
          </div>
        </div>

        {source && source !== "existant" && (
          <div className="card p-4 flex items-center gap-3 text-sm">
            <span className="text-2xl">ℹ️</span>
            <div>
              <div className="text-white font-medium">Pré-rempli depuis : {source}</div>
              <div className="text-xs text-slate-400">Modifiez selon l'avancement de la séance</div>
            </div>
          </div>
        )}

        {!isRealise && (
          <div className="card p-4 bg-amber-900/20 border-amber-500/30 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div className="text-amber-300 text-xs">
              Séance non encore <strong>Réalisée</strong> — les CAC ne remonteront dans la fiche animal qu'après.
            </div>
          </div>
        )}
      </div>

      {/* Grille 14 CAC */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <h3 className="font-semibold text-white text-sm">☑️ Critères Comportementaux Acquis</h3>
        </div>
        <div className="divide-y divide-slate-700/30">
          {Array.from({ length: 14 }, (_, i) => {
            const n = String(i + 1).padStart(2, "0");
            const cacField = `SSC_CAC_${n}`;
            const comField = `SSC_CAC_${n}_COM`;
            const prevVal = prevCac ? (prevCac[cacField] === 1) : null;
            const val = cac[cacField] === 1 || cac[cacField] === true;
            const changed = prevVal !== null && val !== prevVal;
            const lbl = libelles.find(l => l.PLE_CODE === `CAC_${n}`)?.PLE_LIBELLE || `Critère ${i + 1}`;

            return (
              <div key={n} className={`flex items-center gap-3 px-4 py-3 transition-colors
                  ${val ? "bg-indigo-500/8" : "hover:bg-slate-700/20"}`}>
                <div className="w-6 text-xs text-slate-500 font-mono">{i + 1}</div>
                <button
                  onClick={() => setField(cacField, val ? 0 : 1)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                      transition-all font-bold text-sm
                      ${val
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-400"}`}>
                  {val ? "✓" : ""}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${val ? "text-white" : "text-slate-300"}`}>
                    {lbl}
                    {changed && (
                      <span className={`ml-2 text-xs ${val ? "text-green-400" : "text-red-400"}`}>
                        {val ? "▲ acquis" : "▼ perdu"}
                      </span>
                    )}
                  </div>
                </div>
                <input
                  className="input text-xs py-1 w-48 hidden sm:block"
                  placeholder="Commentaire…"
                  value={cac[comField] || ""}
                  onChange={e => setField(comField, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Compte-rendu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label text-sm mb-2">📝 Compte-rendu de séance</label>
          <textarea className="input w-full text-sm" rows={5}
            placeholder="Observations générales, déroulé de la séance…"
            value={cac.SSC_COMMENTAIRE || ""}
            onChange={e => setField("SSC_COMMENTAIRE", e.target.value)} />
        </div>
        <div className="card p-4">
          <label className="label text-sm mb-2">🔍 Observations spécifiques</label>
          <textarea className="input w-full text-sm" rows={5}
            placeholder="Points d'attention pour la prochaine séance…"
            value={cac.SSC_OBSERVATIONS || ""}
            onChange={e => setField("SSC_OBSERVATIONS", e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Sauvegarde…" : saved ? "✓ Enregistré" : "Enregistrer les CAC"}
        </button>
      </div>
    </div>
  );
}
