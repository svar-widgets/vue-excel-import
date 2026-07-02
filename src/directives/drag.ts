export interface DragOptions {
	handle?: string;
	bounds?: boolean;
}

export interface DragAction {
	update(newOptions: DragOptions): void;
	destroy(): void;
}

export function drag(node: HTMLElement, options: DragOptions = {}): DragAction {
	const { handle: handleSelector, bounds = true } = options;

	let handle: HTMLElement | null = handleSelector
		? node.querySelector<HTMLElement>(handleSelector)
		: node;

	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let offsetX = 0;
	let offsetY = 0;

	function onMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;

		const target = e.target as HTMLElement | null;
		if (
			target?.closest('button, input, select, textarea, a, [role="button"]')
		) {
			return;
		}

		isDragging = true;
		startX = e.clientX - offsetX;
		startY = e.clientY - offsetY;

		node.style.transition = "none";
		node.style.cursor = "grabbing";
		if (handle) handle.style.cursor = "grabbing";

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);

		e.preventDefault();
	}

	function onMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		let newX = e.clientX - startX;
		let newY = e.clientY - startY;

		if (bounds) {
			const rect = node.getBoundingClientRect();

			const currentLeft = rect.left - offsetX;
			const currentTop = rect.top - offsetY;

			const minX = -currentLeft;
			const minY = -currentTop;
			const maxX = window.innerWidth - rect.width - currentLeft;
			const maxY = window.innerHeight - rect.height - currentTop;

			newX = Math.max(minX, Math.min(newX, maxX));
			newY = Math.max(minY, Math.min(newY, maxY));
		}

		offsetX = newX;
		offsetY = newY;

		node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
	}

	function onMouseUp() {
		if (!isDragging) return;

		isDragging = false;

		node.style.transition = "";
		node.style.cursor = "";
		if (handle) handle.style.cursor = "grab";

		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}

	function setup() {
		handle = handleSelector
			? node.querySelector<HTMLElement>(handleSelector)
			: node;

		if (handle) {
			handle.style.cursor = "grab";
			handle.addEventListener("mousedown", onMouseDown);
		}
	}

	function cleanup() {
		if (handle) {
			handle.style.cursor = "";
			handle.removeEventListener("mousedown", onMouseDown);
		}
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}

	setup();

	return {
		update(newOptions: DragOptions) {
			cleanup();
			Object.assign(options, newOptions);
			setup();
		},
		destroy() {
			cleanup();
		},
	};
}
