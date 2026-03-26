<script lang="ts">
  import { supabase } from '../../lib/supabase';
  import type { Snippet } from 'svelte';

  interface Props {
    base: string;
    children: Snippet;
  }

  const { base, children }: Props = $props();

  let ready = $state(false);
  let authed = $state(false);

  $effect(() => {
    if (typeof window === 'undefined') return;

    supabase.auth.getSession().then(({ data }) => {
      authed = !!data.session;
      ready = true;

      if (!data.session) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(
            'lms_redirect',
            window.location.pathname + window.location.search + window.location.hash
          );
        }
        window.location.replace(`${base}login/`);
      }
    });
  });
</script>

{#if ready && authed}
  {@render children()}
{/if}
