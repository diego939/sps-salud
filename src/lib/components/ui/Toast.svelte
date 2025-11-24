<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { CheckCircleSolid, CloseCircleOutline } from "flowbite-svelte-icons"
  import { fade } from "svelte/transition";


  export let showToast = true;
  export let successMessage = '';
  const closeToast = () => {
    showToast = false;
  };
  export let type = "success";
  export let dismissible = true;

  onMount(() => {
    setTimeout(() => {
      closeToast();
      successMessage = ''
    }, 5000);
  });

</script>

{#if showToast}
  <section>
    <article class={type} role="alert" transition:fade>
      <CheckCircleSolid size="lg" />

      <div class="text">
        {successMessage}
      </div>
      
      {#if dismissible}
      <button class="close" on:click={() => closeToast()}>
        <CloseCircleOutline width="0.8em" />
      </button>
    {/if}

    </article>
  </section>
{/if}


<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
  }
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    margin: 0 auto 0.5rem auto;
    width: 20rem;
  }
  .error {
    background: IndianRed;
  }
  .success {
    background: MediumSeaGreen;
  }
  .info {
    background: SkyBlue;
  }
  .text {
    margin-left: 1rem;
  }
  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    margin: 0 0 0 auto;
    line-height: 1;
    font-size: 1rem;
  }
</style>