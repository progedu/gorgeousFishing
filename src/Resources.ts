import { Timeline } from "@akashic-extension/akashic-timeline";

/**
 * ゲーム全体で使うリソース
 */
interface Resources {
	readonly font: g.DynamicFont;
	readonly timeline: Timeline;
}

export function getResources(): Resources {
	return g.game.vars.resouces;
}

export function setResources(resouces: Resources): void {
	g.game.vars.resouces = resouces;
}
