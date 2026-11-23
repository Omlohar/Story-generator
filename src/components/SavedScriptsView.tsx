import React, { useState } from 'react';
import { Trash2, ArrowUpRight, Search, FolderOpen } from 'lucide-react';
import { UiCopy } from '../data/i18n';
import { ProductionScript, ScreenFormat } from '../types/script';

interface SavedScriptsViewProps {
  copy: UiCopy;
  savedScripts: ProductionScript[];
  onLoadScript: (script: ProductionScript) => void;
  onDeleteScript: (id: string) => void;
}

export const SavedScriptsView: React.FC<SavedScriptsViewProps> = ({
  copy,
  savedScripts,
  onLoadScript,
  onDeleteScript,
}) => {
  const [query, setQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | ScreenFormat>('all');

  const filtered = savedScripts.filter((item) => {
    const matchesFormat =
      formatFilter === 'all' || item.screenFormat === formatFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q);
    return matchesFormat && matchesQuery;
  });

  if (savedScripts.length === 0) {
    return (
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center max-w-2xl mx-auto mt-6">
        <FolderOpen className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {copy.savedEmptyTitle}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-md mx-auto">
          {copy.savedEmptyDesc}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved scripts..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-[#E11D48] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'short_9_16', label: '9:16 Shorts' },
              { id: 'long_16_9', label: '16:9 Long' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFormatFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                formatFilter === tab.id
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Script Rows */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          No saved scripts match your search or format filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((script) => (
            <article
              key={script.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                  <span className="font-semibold text-[#E11D48]">
                    {script.screenFormat === 'short_9_16'
                      ? '9:16 Short'
                      : '16:9 Long'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{script.scenes.length} Scenes</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {script.estimatedDurationSec >= 60
                      ? `${Math.floor(script.estimatedDurationSec / 60)}m ${script.estimatedDurationSec % 60}s`
                      : `${script.estimatedDurationSec}s`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 line-clamp-2">
                  {script.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {script.hookSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onLoadScript(script)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{copy.loadScriptBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteScript(script.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{copy.deleteScriptBtn}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
