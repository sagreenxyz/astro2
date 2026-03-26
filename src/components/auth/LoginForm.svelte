<script lang="ts">
  import { supabase } from '../../lib/supabase';

  const base = import.meta.env.BASE_URL;

  let email = $state('');
  let password = $state('');
  let errorMsg = $state('');
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMsg = '';
    loading = true;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Map common Supabase auth errors to user-friendly messages
      if (
        error.message.toLowerCase().includes('invalid login') ||
        error.message.toLowerCase().includes('invalid email') ||
        error.message.toLowerCase().includes('invalid password') ||
        error.status === 400
      ) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (error.status === 429) {
        errorMsg = 'Too many sign-in attempts. Please wait a moment and try again.';
      } else {
        errorMsg = 'Sign in failed. Please try again later.';
      }
      loading = false;
    } else {
      const redirect =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lms_redirect')) ||
        `${base}private/`;
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('lms_redirect');
      window.location.replace(redirect);
    }
  }
</script>

<div class="card bg-white shadow-md w-full max-w-sm mx-4">
  <div class="card-body gap-5">
    <!-- Logo / brand -->
    <div class="flex items-center gap-2 justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="login-bolt"
            x1="12"
            y1="2"
            x2="12"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#f97316"></stop>
            <stop offset="100%" stop-color="#f59e0b"></stop>
          </linearGradient>
        </defs>
        <path
          d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5l-1 7.5 9.41-11.96A1 1 0 0019 8.5h-6.5L13 2z"
          fill="url(#login-bolt)"
        ></path>
      </svg>
      <span class="font-bold text-xl tracking-tight text-base-content">Root</span>
    </div>

    <div class="text-center">
      <h1 class="text-2xl font-bold text-base-content">Sign In</h1>
      <p class="text-gray-500 text-sm mt-1 font-sans">Enter your credentials to access the site.</p>
    </div>

    <form class="flex flex-col gap-4 font-sans" onsubmit={handleSubmit}>
      <label class="form-control">
        <div class="label">
          <span class="label-text text-base-content font-medium">Email</span>
        </div>
        <input
          type="email"
          bind:value={email}
          autocomplete="email"
          class="input input-bordered w-full"
          placeholder="you@example.com"
          required
        />
      </label>

      <label class="form-control">
        <div class="label">
          <span class="label-text text-base-content font-medium">Password</span>
        </div>
        <input
          type="password"
          bind:value={password}
          autocomplete="current-password"
          class="input input-bordered w-full"
          placeholder="Password"
          required
        />
      </label>

      <button type="submit" class="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      {#if errorMsg}
        <p class="text-error text-sm text-center">{errorMsg}</p>
      {/if}
    </form>
  </div>
</div>
