export abstract class AStage {

	finishCallback: Array<() => void> = [];

	abstract activate(_s: g.Scene): void;
	abstract dispose(): void;

	finishStage() {
		this.finishCallback.forEach(cb => {cb(); });
	}
}
