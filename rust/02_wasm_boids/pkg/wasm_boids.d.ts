/* tslint:disable */
/* eslint-disable */
export class Boid {
  private constructor();
  free(): void;
}
export class Controller {
  private constructor();
  free(): void;
  static new(): Controller;
  tick(target_x: number, target_y: number): void;
  width(): number;
  height(): number;
  num_boids(): number;
  boids(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_boid_free: (a: number, b: number) => void;
  readonly __wbg_controller_free: (a: number, b: number) => void;
  readonly controller_new: () => number;
  readonly controller_tick: (a: number, b: number, c: number) => void;
  readonly controller_height: (a: number) => number;
  readonly controller_num_boids: (a: number) => number;
  readonly controller_boids: (a: number) => number;
  readonly controller_width: (a: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
