<script lang=ts>
import {validateEmail} from './utils'
import {POST} from './fetch-service'

export let isCompact = false;

const {EMAIL_GATEWAY} = process.env
console.log('EMAIL_GATEWAY', EMAIL_GATEWAY)
let email = "";
let subscribeSuccess = false;
let subscribeError = ""

const handleOnSubscribe = async () => {
	subscribeSuccess=false
	subscribeError=null

    if(!email || !validateEmail(email)){
		subscribeError = "Enter a valid email address."
		return;
	}

	const {data, error, ok} = await POST(EMAIL_GATEWAY, {email})
	if(ok){
	  subscribeSuccess = true
	  console.log("handleOnSubscribe",data)
	}

	if(error){
	  subscribeSuccess = false
	  subscribeError = error
	}
}
</script>

<style>
  .email-sub-bg {
    background-image: url('/sub-bg.svg');
  }
  .email-sub-bg-color {
    background-color: rgba(46, 81, 187, var(--tw-bg-opacity));
  }
  .text-color {
    color: rgba(46, 81, 187, var(--tw-bg-opacity))
  }
  .cap-width {
    max-width: 600px;
  }

</style>

{#if !isCompact}
<div class="flex flex-1 w-full email-sub-bg-color rounded-xl my-4 text-white">
  <div class="flex-grow p-4 cap-width sm:ml-6 md:ml-8">
    <p class="text-xl font-semibold">Don't miss the next auction date!</p>
    <p class="text-lg">Subscribe to get notified with important updates</p>
    <div>
	<div class="flex my-2 justify-between flex-1">
      <div class="flex-grow">
		  <input type="email" placeholder="Email" class="email-sub-bg-color p-2 border rounded-lg w-full" bind:value={email} />
	  </div>
      <div class="ml-4">
		  <button class="btn bg-white px-4 text-color subscribe-btn" on:click={handleOnSubscribe}>Subscribe</button>
	  </div>
    </div>
	{#if subscribeSuccess}
	<p class="text-sm">Thank you! You're now subscribed.</p>
	{/if}
	{#if subscribeError}
	<p class="text-sm text-red-400">{subscribeError}</p>
	{/if}
	</div>
  </div>
  <div class="flex-0 sm:flex-auto md:flex-auto lg:flex-auto email-sub-bg">
  </div>
</div>
{:else}
<div class="flex flex-col flex-1 email-sub-bg-color rounded-xl text-white m-4 md:m-1 p-6 md:p-4">
  <p class="text-md font-semibold">Don't miss the next auction date!</p>
  <p class="text-sm">Subscribe to get notified with important updates</p>
  <div class="flex my-2 justify-between flex-1 md:flex-col">
    <div class="flex-grow">
		<input type="email" placeholder="Email" class="email-sub-bg-color p-2 border rounded-lg w-full md:my-2" bind:value={email} />
	</div>
    <div class="ml-4 md:ml-0 md:w-full">
		<button class="btn bg-white px-4 text-color w-full"  on:click={handleOnSubscribe}>Subscribe</button>
	</div>
	<div>
		{#if subscribeSuccess}
		<p class="text-sm">Thank you! You're now subscribed.</p>
		{/if}
		{#if subscribeError}
		<p class="text-sm text-red-400">{subscribeError}</p>
		{/if}
	</div>
  </div>
</div>
{/if}
