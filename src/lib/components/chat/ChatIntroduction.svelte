<script lang="ts">
	import { PUBLIC_APP_NAME, PUBLIC_VERSION } from "$env/static/public";
	import { PUBLIC_ANNOUNCEMENT_BANNERS } from "$env/static/public";
	import { PUBLIC_APP_DESCRIPTION } from "$env/static/public";
	import Logo from "$lib/components/icons/Logo.svelte";
	import { createEventDispatcher } from "svelte";
	import IconChevron from "$lib/components/icons/IconChevron.svelte";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";
	import AnnouncementBanner from "../AnnouncementBanner.svelte";
	import ModelsModal from "../ModelsModal.svelte";
	import type { Model } from "$lib/types/Model";
	import ModelCardMetadata from "../ModelCardMetadata.svelte";
	import type { LayoutData } from "../../../routes/$types";
	import { findCurrentModel } from "$lib/utils/models";

	// export let currentModel: Model;	
	export let settings: LayoutData["settings"];
	export let models: Model[];

	let isModelsModalOpen = false;

	$: currentModelMetadata = findCurrentModel(models, settings.activeModel);

	const announcementBanners = PUBLIC_ANNOUNCEMENT_BANNERS
		? JSON.parse(PUBLIC_ANNOUNCEMENT_BANNERS)
		: [];

	const dispatch = createEventDispatcher<{ message: string }>();
</script>

<div class="my-auto  gap-8 ">
	<div class="lg:col-span-1 flex items-center justify-center text-center">
		<div>
			<p class="text-base text-gray-600">
				{PUBLIC_APP_DESCRIPTION ||
					"Making the community's best AI chat models available to everyone."}
			</p>
			<p class="text-gray-600 text-3xl font-semibold">
				{PUBLIC_APP_NAME ||
					"Making the community's best AI chat models available to everyone."}
			</p>
		</div>
	</div>
	
	<div class="lg:col-span-2 lg:pl-24">
		

		
		
	</div>
	{#if currentModelMetadata.promptExamples}
		<div class="lg:col-span-3 lg:mt-6">
			<div class="grid gap-3 lg:grid-cols-3 lg:gap-5">
				{#each currentModelMetadata.promptExamples as example}
					<button
						type="button"
						class="rounded-xl border bg-gray-100 p-2.5 text-black-600 sm:p-4"
						on:click={() => dispatch("message", example.prompt)}
					>
						{example.title}
					</button>
				{/each}
			</div>
		</div>{/if}
</div>
