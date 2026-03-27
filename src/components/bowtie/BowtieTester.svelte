<script lang="ts">
  import { BOWTIE_SCENARIOS } from '../../data/bowtie-scenarios';
  import type { BowTieScenario } from '../../data/bowtie-scenarios';

  // ── Types ─────────────────────────────────────────────────────────────────
  type Screen = 'lobby' | 'question' | 'results';

  interface StoredResult {
    score: number;
    attempts: number;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'bowtie-results';

  function loadResults(): Record<string, StoredResult> {
    if (typeof localStorage === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  function saveResult(scenarioId: string, score: number) {
    const all = loadResults();
    const prev = all[scenarioId];
    all[scenarioId] = {
      score: Math.max(score, prev?.score ?? 0),
      attempts: (prev?.attempts ?? 0) + 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function statusEmoji(id: string, results: Record<string, StoredResult>): string {
    const r = results[id];
    if (!r) return '⬜';
    if (r.score === 5) return '✅';
    return '🔄';
  }

  // ── App state ─────────────────────────────────────────────────────────────
  let screen: Screen = $state('lobby');
  let activeScenario: BowTieScenario | null = $state(null);
  let storedResults: Record<string, StoredResult> = $state(loadResults());

  // Selections
  let selectedActionIds: string[] = $state([]);
  let selectedConditionId: string | null = $state(null);
  let selectedParameterIds: string[] = $state([]);

  // Derived
  const canSubmit = $derived(
    selectedActionIds.length === 2 &&
      selectedConditionId !== null &&
      selectedParameterIds.length === 2
  );

  // ── Scoring ───────────────────────────────────────────────────────────────
  interface ScoreResult {
    score: number;
    actionCorrect: Record<string, boolean>;
    conditionCorrect: boolean;
    parameterCorrect: Record<string, boolean>;
  }

  let scoreResult: ScoreResult | null = $state(null);

  function computeScore(scenario: BowTieScenario): ScoreResult {
    const actionCorrect: Record<string, boolean> = {};
    for (const id of selectedActionIds) {
      actionCorrect[id] = scenario.correctActionIds.includes(
        id as (typeof scenario.correctActionIds)[number]
      );
    }
    const conditionCorrect = selectedConditionId === scenario.correctConditionId;
    const parameterCorrect: Record<string, boolean> = {};
    for (const id of selectedParameterIds) {
      parameterCorrect[id] = scenario.correctParameterIds.includes(
        id as (typeof scenario.correctParameterIds)[number]
      );
    }
    const score =
      Object.values(actionCorrect).filter(Boolean).length +
      (conditionCorrect ? 1 : 0) +
      Object.values(parameterCorrect).filter(Boolean).length;
    return { score, actionCorrect, conditionCorrect, parameterCorrect };
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function selectScenario(scenario: BowTieScenario) {
    activeScenario = scenario;
    selectedActionIds = [];
    selectedConditionId = null;
    selectedParameterIds = [];
    scoreResult = null;
    screen = 'question';
  }

  function goToLobby() {
    screen = 'lobby';
    activeScenario = null;
    storedResults = loadResults();
  }

  function handleSubmit() {
    if (!activeScenario || !canSubmit) return;
    const result = computeScore(activeScenario);
    scoreResult = result;
    saveResult(activeScenario.id, result.score);
    storedResults = loadResults();
    screen = 'results';
  }

  function tryAgain() {
    if (!activeScenario) return;
    selectedActionIds = [];
    selectedConditionId = null;
    selectedParameterIds = [];
    scoreResult = null;
    screen = 'question';
  }

  // ── Selection handlers ────────────────────────────────────────────────────
  function toggleAction(id: string) {
    if (selectedActionIds.includes(id)) {
      selectedActionIds = selectedActionIds.filter((x) => x !== id);
    } else if (selectedActionIds.length < 2) {
      selectedActionIds = [...selectedActionIds, id];
    }
  }

  function selectCondition(id: string) {
    selectedConditionId = id;
  }

  function toggleParameter(id: string) {
    if (selectedParameterIds.includes(id)) {
      selectedParameterIds = selectedParameterIds.filter((x) => x !== id);
    } else if (selectedParameterIds.length < 2) {
      selectedParameterIds = [...selectedParameterIds, id];
    }
  }

  // ── Bowtie diagram label helpers ──────────────────────────────────────────
  function actionLabel(idx: number, scenario: BowTieScenario): string {
    const id = selectedActionIds[idx];
    if (!id) return idx === 0 ? 'Action 1' : 'Action 2';
    return scenario.actions.find((a) => a.id === id)?.text ?? id;
  }

  function conditionLabel(scenario: BowTieScenario): string {
    if (!selectedConditionId) return 'Condition';
    return (
      scenario.conditions.find((c) => c.id === selectedConditionId)?.text ?? selectedConditionId
    );
  }

  function paramLabel(idx: number, scenario: BowTieScenario): string {
    const id = selectedParameterIds[idx];
    if (!id) return idx === 0 ? 'Parameter 1' : 'Parameter 2';
    return scenario.parameters.find((p) => p.id === id)?.text ?? id;
  }
</script>

<div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
  <!-- ══ LOBBY ══════════════════════════════════════════════════════════════ -->
  {#if screen === 'lobby'}
    <div>
      <h1 class="text-2xl font-extrabold">🎯 NGN Bowtie Questions</h1>
      <p class="text-sm opacity-60 mt-1">
        Practice NCLEX Next Generation clinical judgment — select actions, condition, and parameters
        for each scenario.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each BOWTIE_SCENARIOS as scenario}
        {@const result = storedResults[scenario.id]}
        <button
          class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow text-left w-full"
          onclick={() => selectScenario(scenario)}
        >
          <div class="card-body py-5 px-5">
            <div class="flex items-start justify-between gap-2">
              <h2 class="card-title text-base font-semibold">{scenario.title}</h2>
              <span
                class="text-xl shrink-0"
                title={result
                  ? `Score: ${result.score}/5 (${result.attempts} attempt${result.attempts === 1 ? '' : 's'})`
                  : 'Not started'}>{statusEmoji(scenario.id, storedResults)}</span
              >
            </div>
            <p class="text-xs text-base-content/60 line-clamp-3 mt-1">{scenario.vignette}</p>
            {#if result}
              <div class="flex gap-2 mt-2">
                <span class="badge badge-sm badge-outline">Best: {result.score}/5</span>
                <span class="badge badge-sm badge-ghost"
                  >{result.attempts} attempt{result.attempts === 1 ? '' : 's'}</span
                >
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>

    <!-- ══ QUESTION ══════════════════════════════════════════════════════════ -->
  {:else if screen === 'question' && activeScenario}
    {@const scenario = activeScenario}

    <button class="btn btn-ghost btn-sm font-sans gap-1" onclick={goToLobby}>← All Scenarios</button
    >

    <!-- Vignette -->
    <div class="card bg-base-200 shadow">
      <div class="card-body">
        <h2 class="card-title text-base">📋 Clinical Vignette — {scenario.title}</h2>
        <p class="text-sm leading-relaxed">{scenario.vignette}</p>
      </div>
    </div>

    <!-- Bowtie diagram -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body py-4 px-4">
        <h3 class="text-xs font-bold uppercase tracking-wide opacity-50 mb-3">Bowtie Summary</h3>
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <!-- Left: actions -->
          <div class="flex flex-col gap-2 min-w-[140px] max-w-[180px]">
            {#each [0, 1] as idx}
              <div
                class="rounded-lg border-2 px-3 py-2 text-xs text-center font-medium {selectedActionIds[
                  idx
                ]
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-base-300 text-base-content/40'}"
              >
                {actionLabel(idx, scenario)}
              </div>
            {/each}
          </div>

          <!-- Arrow left -->
          <div class="text-base-content/30 text-xl select-none">→</div>

          <!-- Center: condition -->
          <div
            class="rounded-xl border-2 px-4 py-3 text-sm text-center font-bold min-w-[140px] max-w-[200px] {selectedConditionId
              ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
              : 'border-base-300 text-base-content/40'}"
          >
            {conditionLabel(scenario)}
          </div>

          <!-- Arrow right -->
          <div class="text-base-content/30 text-xl select-none">→</div>

          <!-- Right: parameters -->
          <div class="flex flex-col gap-2 min-w-[140px] max-w-[180px]">
            {#each [0, 1] as idx}
              <div
                class="rounded-lg border-2 px-3 py-2 text-xs text-center font-medium {selectedParameterIds[
                  idx
                ]
                  ? 'border-teal-400 bg-teal-50 text-teal-800'
                  : 'border-base-300 text-base-content/40'}"
              >
                {paramLabel(idx, scenario)}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Three columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Actions -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-1">
            Actions to Take
            <span class="badge badge-sm badge-outline ml-1">{selectedActionIds.length}/2</span>
          </h3>
          <p class="text-xs opacity-50 mb-3">Select 2</p>
          <div class="space-y-2">
            {#each scenario.actions as opt}
              {@const selected = selectedActionIds.includes(opt.id)}
              <button
                class="w-full text-left rounded-lg border-2 px-3 py-2 text-sm transition-colors {selected
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-base-300 hover:border-blue-200 hover:bg-blue-50/30'} {!selected &&
                selectedActionIds.length >= 2
                  ? 'opacity-40 cursor-not-allowed'
                  : ''}"
                onclick={() => toggleAction(opt.id)}
                disabled={!selected && selectedActionIds.length >= 2}
              >
                {opt.text}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Conditions -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-1">
            Condition Most Likely Experiencing
            <span class="badge badge-sm badge-outline ml-1">{selectedConditionId ? 1 : 0}/1</span>
          </h3>
          <p class="text-xs opacity-50 mb-3">Select 1</p>
          <div class="space-y-2">
            {#each scenario.conditions as opt}
              {@const selected = selectedConditionId === opt.id}
              <button
                class="w-full text-left rounded-lg border-2 px-3 py-2 text-sm transition-colors {selected
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                  : 'border-base-300 hover:border-indigo-200 hover:bg-indigo-50/30'}"
                onclick={() => selectCondition(opt.id)}
              >
                {opt.text}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Parameters -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-1">
            Parameters to Monitor
            <span class="badge badge-sm badge-outline ml-1">{selectedParameterIds.length}/2</span>
          </h3>
          <p class="text-xs opacity-50 mb-3">Select 2</p>
          <div class="space-y-2">
            {#each scenario.parameters as opt}
              {@const selected = selectedParameterIds.includes(opt.id)}
              <button
                class="w-full text-left rounded-lg border-2 px-3 py-2 text-sm transition-colors {selected
                  ? 'border-teal-400 bg-teal-50 text-teal-800'
                  : 'border-base-300 hover:border-teal-200 hover:bg-teal-50/30'} {!selected &&
                selectedParameterIds.length >= 2
                  ? 'opacity-40 cursor-not-allowed'
                  : ''}"
                onclick={() => toggleParameter(opt.id)}
                disabled={!selected && selectedParameterIds.length >= 2}
              >
                {opt.text}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="flex justify-end">
      <button class="btn btn-primary font-sans" onclick={handleSubmit} disabled={!canSubmit}>
        Submit Answers
      </button>
    </div>

    <!-- ══ RESULTS ════════════════════════════════════════════════════════════ -->
  {:else if screen === 'results' && activeScenario && scoreResult}
    {@const scenario = activeScenario}
    {@const sr = scoreResult}

    <button class="btn btn-ghost btn-sm font-sans gap-1" onclick={goToLobby}>← All Scenarios</button
    >

    <!-- Score banner -->
    <div
      class="alert {sr.score === 5
        ? 'alert-success'
        : sr.score >= 3
          ? 'alert-warning'
          : 'alert-error'}"
    >
      <span class="text-xl">{sr.score === 5 ? '🏆' : sr.score >= 3 ? '👍' : '📚'}</span>
      <div>
        <div class="font-bold">Score: {sr.score} / 5</div>
        <div class="text-sm">
          {sr.score === 5
            ? 'Perfect! All selections correct.'
            : sr.score >= 3
              ? 'Good effort — review the rationale below.'
              : 'Keep practicing — read the rationale to strengthen your clinical reasoning.'}
        </div>
      </div>
    </div>

    <!-- Results breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Actions result -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-3">Actions to Take</h3>
          <div class="space-y-2">
            {#each scenario.actions as opt}
              {@const wasSelected = selectedActionIds.includes(opt.id)}
              {@const isCorrect = scenario.correctActionIds.includes(
                opt.id as (typeof scenario.correctActionIds)[number]
              )}
              {#if wasSelected || isCorrect}
                <div
                  class="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm {wasSelected &&
                  isCorrect
                    ? 'border-success bg-success/10'
                    : wasSelected && !isCorrect
                      ? 'border-error bg-error/10'
                      : 'border-success/30 bg-success/5 opacity-70'}"
                >
                  <span class="shrink-0 mt-0.5"
                    >{wasSelected && isCorrect
                      ? '✅'
                      : wasSelected && !isCorrect
                        ? '❌'
                        : '✅'}</span
                  >
                  <span>{opt.text}{!wasSelected && isCorrect ? ' (missed)' : ''}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>

      <!-- Condition result -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-3">Condition</h3>
          <div class="space-y-2">
            {#each scenario.conditions as opt}
              {@const wasSelected = selectedConditionId === opt.id}
              {@const isCorrect = opt.id === scenario.correctConditionId}
              {#if wasSelected || isCorrect}
                <div
                  class="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm {wasSelected &&
                  isCorrect
                    ? 'border-success bg-success/10'
                    : wasSelected && !isCorrect
                      ? 'border-error bg-error/10'
                      : 'border-success/30 bg-success/5 opacity-70'}"
                >
                  <span class="shrink-0 mt-0.5"
                    >{wasSelected && isCorrect
                      ? '✅'
                      : wasSelected && !isCorrect
                        ? '❌'
                        : '✅'}</span
                  >
                  <span>{opt.text}{!wasSelected && isCorrect ? ' (missed)' : ''}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>

      <!-- Parameters result -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body py-4 px-4">
          <h3 class="font-bold text-sm mb-3">Parameters to Monitor</h3>
          <div class="space-y-2">
            {#each scenario.parameters as opt}
              {@const wasSelected = selectedParameterIds.includes(opt.id)}
              {@const isCorrect = scenario.correctParameterIds.includes(
                opt.id as (typeof scenario.correctParameterIds)[number]
              )}
              {#if wasSelected || isCorrect}
                <div
                  class="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm {wasSelected &&
                  isCorrect
                    ? 'border-success bg-success/10'
                    : wasSelected && !isCorrect
                      ? 'border-error bg-error/10'
                      : 'border-success/30 bg-success/5 opacity-70'}"
                >
                  <span class="shrink-0 mt-0.5"
                    >{wasSelected && isCorrect
                      ? '✅'
                      : wasSelected && !isCorrect
                        ? '❌'
                        : '✅'}</span
                  >
                  <span>{opt.text}{!wasSelected && isCorrect ? ' (missed)' : ''}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Rationale -->
    <div class="card bg-base-200 shadow">
      <div class="card-body">
        <h3 class="card-title text-base">💡 Rationale</h3>
        <p class="text-sm leading-relaxed">{scenario.rationale}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 flex-wrap">
      <button class="btn btn-outline btn-primary font-sans" onclick={tryAgain}>🔄 Try Again</button>
      <button class="btn btn-ghost font-sans" onclick={goToLobby}>← Back to Scenarios</button>
    </div>
  {/if}
</div>
