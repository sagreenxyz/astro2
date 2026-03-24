<script lang="ts">
  import type { CurriculumAlignment } from '../../types/nursing';
  import type { AacnDomain } from '../../types/nursing';
  import type { QsenCompetency } from '../../types/nursing';

  interface Props {
    alignment: CurriculumAlignment;
    aacnData?: AacnDomain[];
    qsenData?: QsenCompetency[];
  }

  let { alignment, aacnData = [], qsenData = [] }: Props = $props();

  const aacnLabels: Record<string, string> = {
    D1: 'Knowledge for Nursing Practice',
    D2: 'Person-Centered Care',
    D3: 'Population Health',
    D4: 'Scholarship for the Nursing Discipline',
    D5: 'Quality and Safety',
    D6: 'Interprofessional Partnerships',
    D7: 'Systems-Based Practice',
    D8: 'Informatics and Healthcare Technologies',
    D9: 'Professionalism',
    D10: 'Personal, Professional, and Leadership Development',
  };

  const qsenLabels: Record<string, string> = {
    PCC: 'Patient-Centered Care',
    TC: 'Teamwork and Collaboration',
    EBP: 'Evidence-Based Practice',
    QI: 'Quality Improvement',
    S: 'Safety',
    I: 'Informatics',
  };

  const nclexLayerLabels: Record<string, string> = {
    RC: 'Recognize Cues',
    AC: 'Analyze Cues',
    PH: 'Prioritize Hypotheses',
    GS: 'Generate Solutions',
    TA: 'Take Action',
    EO: 'Evaluate Outcomes',
  };

  const nclexCatLabels: Record<string, string> = {
    SECE: 'Safe and Effective Care Environment',
    HPM: 'Health Promotion and Maintenance',
    PI: 'Psychosocial Integrity',
    PhysI: 'Physiological Integrity',
    MC: 'Management of Care',
    SIC: 'Safety and Infection Control',
    BCC: 'Basic Care and Comfort',
    PPT: 'Pharmacological and Parenteral Therapies',
    RRP: 'Reduction of Risk Potential',
    PA: 'Physiological Adaptation',
  };

  const hasAny =
    (alignment.aacnEssentials?.length ?? 0) > 0 ||
    (alignment.qsenCompetencies?.length ?? 0) > 0 ||
    (alignment.nclexLayers?.length ?? 0) > 0 ||
    (alignment.nclexCategories?.length ?? 0) > 0 ||
    (alignment.accreditationRefs?.length ?? 0) > 0 ||
    (alignment.learningObjectives?.length ?? 0) > 0;
</script>

{#if hasAny}
  <aside class="mt-8 border border-base-300 rounded-lg p-5 font-sans text-sm">
    <h2 class="text-base font-semibold mb-4 text-base-content/80 uppercase tracking-wide">
      Curriculum Alignment
    </h2>

    <!-- Learning Objectives -->
    {#if alignment.learningObjectives && alignment.learningObjectives.length > 0}
      <section class="mb-4">
        <h3 class="font-semibold text-base-content/70 mb-2">Learning Objectives</h3>
        <ol class="list-decimal list-inside space-y-1 text-base-content/80">
          {#each alignment.learningObjectives as obj}
            <li>{obj}</li>
          {/each}
        </ol>
      </section>
    {/if}

    <!-- AACN Essentials -->
    {#if alignment.aacnEssentials && alignment.aacnEssentials.length > 0}
      <section class="mb-4">
        <h3 class="font-semibold text-base-content/70 mb-2">AACN Essentials (2021)</h3>
        <div class="flex flex-wrap gap-2">
          {#each alignment.aacnEssentials as id}
            <span class="badge badge-primary badge-sm" title={aacnLabels[id] ?? id}>
              {id}: {aacnLabels[id] ?? id}
            </span>
          {/each}
        </div>
      </section>
    {/if}

    <!-- QSEN Competencies -->
    {#if alignment.qsenCompetencies && alignment.qsenCompetencies.length > 0}
      <section class="mb-4">
        <h3 class="font-semibold text-base-content/70 mb-2">QSEN Competencies</h3>
        <div class="flex flex-wrap gap-2">
          {#each alignment.qsenCompetencies as id}
            <span class="badge badge-secondary badge-sm" title={qsenLabels[id] ?? id}>
              {qsenLabels[id] ?? id}
            </span>
          {/each}
        </div>
      </section>
    {/if}

    <!-- NCLEX-NG Clinical Judgment Layers -->
    {#if alignment.nclexLayers && alignment.nclexLayers.length > 0}
      <section class="mb-4">
        <h3 class="font-semibold text-base-content/70 mb-2">NCLEX-NG Clinical Judgment</h3>
        <div class="flex flex-wrap gap-2">
          {#each alignment.nclexLayers as id}
            <span class="badge badge-accent badge-sm" title={nclexLayerLabels[id] ?? id}>
              {nclexLayerLabels[id] ?? id}
            </span>
          {/each}
        </div>
      </section>
    {/if}

    <!-- NCLEX Client Needs -->
    {#if alignment.nclexCategories && alignment.nclexCategories.length > 0}
      <section class="mb-4">
        <h3 class="font-semibold text-base-content/70 mb-2">NCLEX Client Needs</h3>
        <div class="flex flex-wrap gap-2">
          {#each alignment.nclexCategories as id}
            <span
              class="badge badge-accent badge-outline badge-sm"
              title={nclexCatLabels[id] ?? id}
            >
              {nclexCatLabels[id] ?? id}
            </span>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Accreditation References -->
    {#if alignment.accreditationRefs && alignment.accreditationRefs.length > 0}
      <section class="mb-0">
        <h3 class="font-semibold text-base-content/70 mb-2">Accreditation Standards</h3>
        <div class="flex flex-wrap gap-2">
          {#each alignment.accreditationRefs as id}
            <span class="badge badge-neutral badge-sm">{id}</span>
          {/each}
        </div>
      </section>
    {/if}
  </aside>
{/if}
