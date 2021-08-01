declare module "@cypress/xvfb" {
  import { ChildProcess } from "child_process";

  interface Options {
    displayNum?: string;
    reuse?: boolean;
    timeout?: number;
    silent?: boolean;
    onStderrData?: (buffer: Buffer) => void;
    xvfb_args?: string[];
  }
  class Xvfb {
    constructor(o: Options);

    start(cb: (err: Error | null, process?: ChildProcess) => void): void;
    stop(cb: (err: Error | null) => void): void;
    display(): string;

    private _display?: string;
    private _reuse: boolean;
    private _timeout: number;
    private _silent: boolean;
    private _onStderrData: (buffer: Buffer) => void;
    private _xvfb_args: string[];
    private _process?: ChildProcess;
  }
  export default Xvfb;
}
