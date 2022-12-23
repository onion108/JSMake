/**
 * Execute a shell command using an `argv` array.
 * @param {string[]} argv
 */
export function shellRaw(argv: string[]): Promise<any>;
/**
 * Execute a shell command.
 * @param {string} cmd The command to execute.
 * @param {boolean} [echo=true] Determine if the command itself should be printed to the screen.
 * @returns
 */
export function shell(cmd: string, echo?: boolean): Promise<void>;
export namespace variables {
    const CC: string;
    const CXX: string;
    const CC_FLAGS: string;
    const CXX_FLAGS: string;
    const GO: string;
    const GO_FLAGS: string;
    const NPM: string;
    const IGNORE_ERRORS: boolean;
    const SOURCE_INCLUDED: string[];
    const NODE_INTERPRETER: string;
    const GIT: string;
    const LD: string;
    const LD_FLAGS: string;
    const CARGO: string;
    const RUSTC: string;
    const RUSTUP: string;
    const JAVAC: string;
    const JAVA: string;
    const JAR: string;
}
/**
 * Build C source files.
 * @param  {...string} c_sources The path to sources.
 */
export function buildC(...c_sources: string[]): Promise<void>;
/**
 * Build C++ source files.
 * @param  {...string} cxx_sources The path to sources.
 */
export function buildCxx(...cxx_sources: string[]): Promise<void>;
/**
 * Build C++ source files to a named executable.
 * @param {string} name The name of the executable.
 * @param  {...string} cxx_sources The path to sources.
 */
export function buildExecutable(name: string, ...cxx_sources: string[]): Promise<void>;
/**
 * Build go packages.
 */
export function buildGoPackages(): Promise<void>;
/**
 * Define a build task.
 * @param {string} taskName The task's name.
 * @param {()=>void} task The task itself.
 */
export function task(taskName: string, task: () => void): void;
/**
 * Start the build script.
 */
export function build(): Promise<void>;
/**
 * Build a task with the name.
 * @param {string} name The name of the task.
 */
export function buildTask(name: string): Promise<void>;
/**
 * Execute the `npm` command.
 * @param  {...string} args Arguments to pass to `npm`.
 */
export function npm(...args: string[]): Promise<void>;
export namespace nodePack {
    /**
     * Set the version number of the npm.
     * @param {string} v The new version.
     */
    function version(v: string): Promise<void>;
    /**
     * Set the version number of the npm.
     * @param {string} v The new version.
     */
    function version(v: string): Promise<void>;
    /**
     * Publish a node package.
     */
    function publish(): Promise<void>;
    /**
     * Publish a node package.
     */
    function publish(): Promise<void>;
    /**
     * Install a node package.
     * @param {string} pack_name Package's name.
     */
    function install(pack_name: string): Promise<void>;
    /**
     * Install a node package.
     * @param {string} pack_name Package's name.
     */
    function install(pack_name: string): Promise<void>;
    /**
     * Patch the version number of the node package.
     */
    function patch(): Promise<void>;
    /**
     * Patch the version number of the node package.
     */
    function patch(): Promise<void>;
}
/**
 * Call `callback` for every file under the directory.
 * @param {string} dir Path to the directory.
 * @param {(pthName: string)=>void} callback The callback.
 */
export function dir(dir: string, callback: (pthName: string) => void): Promise<void>;
/**
 * Select a source.
 * @param {string} src The name of the source.
 */
export function selectSource(src: string): void;
/**
 * Include a source.
 * @param {string} src The name of the source.
 */
export function includeSource(src: string): void;
/**
 * Include all the sources in the working directory.
 */
export function includeAllInDir(): void;
/**
 * Check if the source is included.
 * @param {string} src The source to include.
 * @returns {boolean} `true` if the source is included, `false` otherwise.
 */
export function isIncluded(src: string): boolean;
/**
 * Include all the sources that are selected.
 */
export function includeAllSelected(): void;
/**
 * Select all the sources that are included.
 */
export function selectAllIncluded(): void;
/**
 * Compile all the selected sources as C and deselect them.
 */
export function compileAllSelectedAsC(): Promise<void>;
/**
 * Compile all the selected sources as C++ and deselect them.
 */
export function compileAllSelectedAsCxx(): Promise<void>;
/**
 * Check if a file exists.
 * @param {string} path Path to the file.
 * @returns {boolean} `true` if the file exists and `false` otherwise.
 */
export function exists(path: string): boolean;
/**
 * Delete a file.
 * @param {string} path Path to the file.
 */
export function rm(path: string): void;
export namespace git {
    /**
     * Check if the directory is a git repository.
     * @returns {boolean} `true` if the directory is a git repository and `false` otherwise.
     */
    function isGitted(): boolean;
    /**
     * Check if the directory is a git repository.
     * @returns {boolean} `true` if the directory is a git repository and `false` otherwise.
     */
    function isGitted(): boolean;
    /**
     * Initialize the directory as a git repository.
     */
    function init(): Promise<void>;
    /**
     * Initialize the directory as a git repository.
     */
    function init(): Promise<void>;
    /**
     * Add files to the repository.
     * @param  {...string} paths The path to files to add.
     */
    function add(...paths: string[]): Promise<void>;
    /**
     * Add files to the repository.
     * @param  {...string} paths The path to files to add.
     */
    function add(...paths: string[]): Promise<void>;
    /**
     * Push the repository.
     */
    function push(): Promise<void>;
    /**
     * Push the repository.
     */
    function push(): Promise<void>;
    /**
     * Push the repository with given options.
     * @param  {...string} options Options to pass.
     */
    function pushWithOptions(...options: string[]): Promise<void>;
    /**
     * Push the repository with given options.
     * @param  {...string} options Options to pass.
     */
    function pushWithOptions(...options: string[]): Promise<void>;
    /**
     * Execute `git branch` with given options.
     * @param  {...string} options Options to pass.
     */
    function branch(...options: string[]): Promise<void>;
    /**
     * Execute `git branch` with given options.
     * @param  {...string} options Options to pass.
     */
    function branch(...options: string[]): Promise<void>;
    /**
     * Execute `git remote add origin` with given options.
     * @param {string} originName The name of the origin.
     * @param {string} url The url of the origin.
     */
    function remoteAddOrigin(originName: string, url: string): Promise<void>;
    /**
     * Execute `git remote add origin` with given options.
     * @param {string} originName The name of the origin.
     * @param {string} url The url of the origin.
     */
    function remoteAddOrigin(originName: string, url: string): Promise<void>;
    /**
     * Execute `git remote add origin` with given options on the given branch.
     * @param {string} branch The branch to set.
     * @param {string} originName The name of the origin.
     * @param {string} url The url of the origin.
     */
    function remoteAddOriginForBranch(branch: string, originName: string, url: string): Promise<void>;
    /**
     * Execute `git remote add origin` with given options on the given branch.
     * @param {string} branch The branch to set.
     * @param {string} originName The name of the origin.
     * @param {string} url The url of the origin.
     */
    function remoteAddOriginForBranch(branch: string, originName: string, url: string): Promise<void>;
    /**
     *
     * @param  {...string} options Arguments.
     */
    function invoke(...options: string[]): Promise<void>;
    /**
     *
     * @param  {...string} options Arguments.
     */
    function invoke(...options: string[]): Promise<void>;
    /**
     * Commit the repository with the given message.
     * @param {string} msg The message to display.
     */
    function commit(msg: string): Promise<void>;
    /**
     * Commit the repository with the given message.
     * @param {string} msg The message to display.
     */
    function commit(msg: string): Promise<void>;
}
/**
 *
 * @param {string} patha The path to file A
 * @param {string} pathb The path to file B
 * @returns Whether file A is newer than file B.
 */
export function newer(patha: string, pathb: string): boolean;
/**
 * Build the task from another build script.
 * @param {string} path_to_script Path to the script.
 * @param {string} taskName The task name.
 */
export function buildTaskFrom(path_to_script: string, taskName: string): Promise<void>;
/**
 * Iterate the directoy and call the callback if and only if the `rule` callback returns true for that filename.
 * @param {string} path The path.
 * @param {(s:string)=>boolean} rule The rule.
 * @param {(s:string)=>void} callback The callback.
 */
export function dirIf(path: string, rule: (s: string) => boolean, callback: (s: string) => void): Promise<void>;
/**
 * Link the object files.
 * @param  {...string} object_files Path to object files.
 */
export function link(...object_files: string[]): Promise<void>;
/**
 * Run the `cargo` command.
 * @param  {...string} args Arguments.
 */
export function cargo(...args: string[]): Promise<void>;
/**
 * Run the `rustc` command.
 * @param  {...string} args Arguments.
 */
export function rustc(...args: string[]): Promise<void>;
/**
 * Run the `rustup` command.
 * @param  {...string} args Arguments.
 */
export function rustup(...args: string[]): Promise<void>;
/**
 * Run the `java` command.
 * @param  {...string} args Arguments.
 */
export function java(...args: string[]): Promise<void>;
/**
 * Run the `javac` command.
 * @param  {...string} args Arguments.
 */
export function javac(...args: string[]): Promise<void>;
