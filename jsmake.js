const {
	argv
} = require('process');
const fs = require('fs');
const path = require('path');


module.exports = (function () {
	const {
		exec, spawn
	} = require('child_process');
	let glob = {};
	// Shell command support
	let privates = {};
	privates["tasks"] = {};
	privates["source_set"] = [];

	/**
	 * Convert command string to `argv` array.
	 * @param {string} cmd_str 
	 * @returns {string[]} The arguments.
	 */
	function _commandArgConverter(cmd_str) {
		let parseState = 0;
		let buffer = "";

		/**
		 * @type {string[]}
		 */
		let result = [];
		for (let i of cmd_str) {
			if (parseState === 0) {

				if (i === " " && buffer !== "") {
					result.push(buffer);
					buffer = "";
					continue;
				}

				if (i === "\"") {
					parseState = 1;
					continue;
				}

				buffer += i

				continue;
			}
			if (parseState === 1) {
				if (i === "\"") {
					parseState = 0;
					continue;
				}
				buffer += i;
			}
		}
		if (buffer !== "") {
			result.push(buffer);
		}
		return result;
	}

	/**
	 * Execute a shell command using an `argv` array.
	 * @param {string[]} argv
	 */
	glob["shellRaw"] = async function (argv) {
		if (argv.length < 1) {
			throw new Error("Not enough arguments");
		}
		let awaiter = new Promise((res, rej) => {
			let process = spawn(argv[0], argv.slice(1));
			process.stdout.on('data', data => {
				console.log(`${data}`);
			});
			process.stderr.on('data', data => {
				console.error(`${data}`);
			});
			process.on('error', error => {
				console.log(error);
			});
			process.on('close', code => {
				res();
			});
		});
		return awaiter;
	};

	/**
	 * Execute a shell command.
	 * @param {string} cmd The command to execute.
	 * @param {boolean} [echo=true] Determine if the command itself should be printed to the screen.
	 * @returns 
	 */
	glob["shell"] = async function (cmd, echo = true) {
		if (echo) {
			console.log(cmd);
		}
		await this.shellRaw(_commandArgConverter(cmd));
	};
	glob["variables"] = {

		/**
		 * The C compiler to use.
		 */
		"CC": "gcc",

		/**
		 * The C++ compiler to use.
		 */
		"CXX": "g++",

		/**
		 * The arguments to pass to the C compiler.
		 */
		"CC_FLAGS": "",
		
		/**
		 * The arguments to pass to the C++ compiler.
		 */
		"CXX_FLAGS": "",

		/**
		 * The Go compiler to use.
		 */
		"GO": "go",

		/**
		 * The arguments to pass to the Go compiler.
		 */
		"GO_FLAGS": "",

		/**
		 * The node package manager to use.
		 */
		"NPM": "npm", // May use yarn or something

		/**
		 * Shall we ignore errors and continue building or 
		 * stop immediately.
		 */
		"IGNORE_ERRORS": false,
		/**
		 * @type {string[]}
		 */
		"SOURCE_INCLUDED": [],

		/**
		 * The nodejs interpreter to use.
		 */
		"NODE_INTERPRETER": "node",

		/**
		 * The git to use.
		 */
		"GIT": "git",

		/**
		 * The linker to use.
		 */
		"LD": "ld",

		/**
		 * The arguments to pass to the linker.
		 */
		"LD_FLAGS": "",

		/**
		 * The rust package manager to use.
		 */
		"CARGO": "cargo",

		/**
		 * The rust compiler to use.
		 */
		"RUSTC": "rustc",

		/**
		 * The rust toolchain installer to use.
		 */
		"RUSTUP": "rustup",

		/**
		 * The java compiler to use.
		 */
		"JAVAC": "javac",

		/**
		 * The java vm to use.
		 */
		"JAVA": "java",

		/**
		 * The java archiever to use.
		 */
		"JAR": "jar",
	};

	/**
	 * Build C source files.
	 * @param  {...string} c_sources The path to sources.
	 */
	glob["buildC"] = async function (...c_sources) {
		await this.shell(`${this.variables.CC} ${this.variables.CC_FLAGS} ${c_sources.join(' ')}`)
	};

	/**
	 * Build C++ source files.
	 * @param  {...string} cxx_sources The path to sources.
	 */
	glob["buildCxx"] = async function (...cxx_sources) {
		await this.shell(`${this.variables.CXX} ${this.variables.CXX_FLAGS} ${cxx_sources.join(' ')}`)
	};

	/**
	 * Build C++ source files to a named executable.
	 * @param {string} name The name of the executable.
	 * @param  {...string} cxx_sources The path to sources.
	 */
	glob["buildExecutable"] = async function (name, ...cxx_sources) {
		await this.shell(`${this.variables.CXX} ${this.variables.CXX_FLAGS} -o ${name} ${cxx_sources.join(' ')}`)
	}

	/**
	 * Build go packages.
	 */
	glob["buildGoPackages"] = async function () {
		await this.shell(`${this.variables.GO} build ${this.variables.GO_FLAGS}`)
	};

	/**
	 * Define a build task.
	 * @param {string} taskName The task's name.
	 * @param {()=>void} task The task itself.
	 */
	glob["task"] = function (taskName, task) {
		if (typeof (taskName) !== "string" || typeof (task) !== "function") {
			throw new Error("TypeError");
		}
		privates.tasks[taskName] = task;
	};

	/**
	 * Start the build script.
	 */
	glob["build"] = async function () {
		// Determine by the command argument
		if (argv.slice(2).length == 0) {
			throw new Error("error: no enough argument.");
		}
		if (privates.tasks["pre before"]) {
			await this.buildTask("pre before");
		}
		try {
			await this.buildTask(argv[2]);
		} catch(e) {
			console.error(e);
		}
		if (privates.tasks["pre after"]) {
			await this.buildTask("pre after");
		}
	};

	/**
	 * Build a task with the name.
	 * @param {string} name The name of the task.
	 */
	glob["buildTask"] = async function (name) {
		if (typeof (name) !== "string") {
			throw new Error("TypeError");
		}
		if (typeof (privates.tasks[name]) !== "function") {
			throw new Error(`Unknown task name: ${name}`);
		}
		console.log(`Start building task ${name}...`)
		try {
			await privates.tasks[name]();
		} catch (e) {
			console.log(`jsmake: ***Make Failed due to following errors***\n${e}`);
			throw e;
		}
	};

	/**
	 * Execute the `npm` command.
	 * @param  {...string} args Arguments to pass to `npm`.
	 */
	glob["npm"] = async function (...args) {
		await this.shellRaw([glob.variables.NPM, ...args]);
	};

	/**
	 * A bunch of methods to operate with npm.
	 */
	glob["nodePack"] = {

		/**
		 * Set the version number of the npm.
		 * @param {string} v The new version.
		 */
		async version(v) {
			await glob.shell(`${glob.variables.NPM} version ${v}`);
		},

		/**
		 * Publish a node package.
		 */
		async publish() {
			await glob.shell(`${glob.variables.NPM} publish`);
		},

		/**
		 * Install a node package.
		 * @param {string} pack_name Package's name.
		 */
		async install(pack_name) {
			if (glob.variables.NPM == "yarn") {
				await glob.shell(`${glob.variables.NPM} add ${pack_name}`);
			} else {
				await glob.shell(`${glob.variables.NPM} install ${pack_name}`);
			}
		},

		/**
		 * Patch the version number of the node package.
		 */
		async patch() {
			await glob.npm('version', 'patch');
		},
	};

	/**
	 * Call `callback` for every file under the directory.
	 * @param {string} dir Path to the directory.
	 * @param {(pthName: string)=>void} callback The callback.
	 */
	glob["dir"] = async function(dir, callback) {
		if (typeof dir !== "string") {
			throw new TypeError("dir must be a string");
		}
		if (typeof callback !== "function") {
			throw new TypeError("callback should be a callback function");
		}
		let ds = fs.readdirSync(dir);
		for (i of ds) {
			callback(i);
		}
	};

	/**
	 * Select a source.
	 * @param {string} src The name of the source.
	 */
	glob["selectSource"] = function(src) {
		privates.source_set.push(string(src));
	};

	/**
	 * Include a source.
	 * @param {string} src The name of the source.
	 */
	glob["includeSource"] = function(src) {
		this.variables.SOURCE_INCLUDED.push(src);
	};

	/**
	 * Include all the sources in the working directory.
	 */
	glob["includeAllInDir"] = function() {
		this.dir('.', (path) => {
			this.includeSource(path);
		});
	};

	/**
	 * Check if the source is included.
	 * @param {string} src The source to include.
	 * @returns {boolean} `true` if the source is included, `false` otherwise.
	 */
	glob["isIncluded"] = function(src) {
		for (let i of this.variables.SOURCE_INCLUDED) {
			if (i === src || path.resolve(src) === path.resolve(i)) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Include all the sources that are selected.
	 */
	glob["includeAllSelected"] = function() {
		for (let i of privates.source_set) {
			this.includeSource(i);
		}
	};

	/**
	 * Select all the sources that are included.
	 */
	glob["selectAllIncluded"] = function() {
		for (let i of this.variables.SOURCE_INCLUDED) {
			this.selectSource(i);
		}
	};
	
	/**
	 * Compile all the selected sources as C and deselect them.
	 */
	glob["compileAllSelectedAsC"] = async function() {
		await this.buildC(...privates.source_set);
		privates.source_set = [];
	};
	/**
	 * Compile all the selected sources as C++ and deselect them.
	 */
	glob["compileAllSelectedAsCxx"] = async function() {
		await this.buildCxx(...privates.source_set);
		privates.source_set = [];
	};

	/**
	 * Check if a file exists.
	 * @param {string} path Path to the file.
	 * @returns {boolean} `true` if the file exists and `false` otherwise.
	 */
	glob["exists"] = function(path) {
		// Return if the path exists
		return fs.existsSync(path);
	};

	/**
	 * Delete a file.
	 * @param {string} path Path to the file.
	 */
	glob["rm"] = function(path) {
		fs.rmSync(path);
	};

	// Git support.
	glob["git"] = {

		/**
		 * Check if the directory is a git repository.
		 * @returns {boolean} `true` if the directory is a git repository and `false` otherwise.
		 */
		isGitted() {
			return glob.exists(".git");
		},

		/**
		 * Initialize the directory as a git repository.
		 */
		async init() {
			await glob.shell(`${glob.variables.GIT} init`);
		},

		/**
		 * Add files to the repository.
		 * @param  {...string} paths The path to files to add.
		 */
		async add(...paths) {
			await glob.shell(`${glob.variables.GIT} add ${paths.join(' ')}`);
		},

		/**
		 * Push the repository.
		 */
		async push() {
			await glob.shell(`${glob.variables.GIT} push`)
		},

		/**
		 * Push the repository with given options.
		 * @param  {...string} options Options to pass.
		 */
		async pushWithOptions(...options) {
			await glob.shell(`${glob.variables.GIT} push ${options.join(' ')}`);
		},

		/**
		 * Execute `git branch` with given options.
		 * @param  {...string} options Options to pass.
		 */
		async branch(...options) {
			await glob.shell(`${glob.variables.GIT} branch ${options.join(' ')}`);
		},

		/**
		 * Execute `git remote add origin` with given options.
		 * @param {string} originName The name of the origin.
		 * @param {string} url The url of the origin.
		 */
		async remoteAddOrigin(originName, url) {
			await glob.shell(`${glob.variables.GIT} remote add ${originName} ${url}`);
		},

		/**
		 * Execute `git remote add origin` with given options on the given branch.
		 * @param {string} branch The branch to set.
		 * @param {string} originName The name of the origin.
		 * @param {string} url The url of the origin.
		 */
		async remoteAddOriginForBranch(branch, originName, url) {
			await glob.shell(`${glob.variables.GIT} remote add -t ${branch} ${originName} ${url}`);
		},

		/**
		 * 
		 * @param  {...string} options Arguments.
		 */
		async invoke(...options) {
			await glob.shellRaw([glob.variables.GIT, ...options]);
		},

		/**
		 * Commit the repository with the given message.
		 * @param {string} msg The message to display.
		 */
		async commit(msg) {
			await this.invoke('commit', '-m', msg);
		},
	};
	
	/**
	 * 
	 * @param {string} patha The path to file A
	 * @param {string} pathb The path to file B
	 * @returns Whether file A is newer than file B.
	 */
	glob["newer"] = function(patha, pathb) {
		let pas = fs.statSync(patha);
		let pbs = fs.statSync(pathb);
		return pas.mtime.getTime() > pbs.mtime.getTime();
	};
	
	/**
	 * Build the task from another build script.
	 * @param {string} path_to_script Path to the script.
	 * @param {string} taskName The task name.
	 */
	glob["buildTaskFrom"] = async function(path_to_script, taskName) {
		await this.shell(`${this.variables.NODE_INTERPRETER} ${path_to_script} ${taskName}`);
	};
	
	/**
	 * Iterate the directoy and call the callback if and only if the `rule` callback returns true for that filename.
	 * @param {string} path The path.
	 * @param {(s:string)=>boolean} rule The rule.
	 * @param {(s:string)=>void} callback The callback.
	 */
	glob["dirIf"] = async function(path, rule, callback) {
		if (typeof path !== "string" || typeof rule !== "function" || typeof path !== "function") {
			console.error("Invalid Type");
			throw new TypeError("Invalid Argument Type");
		}
		this.dir(path, (fpath) => {
			if (rule(path)) {
				callback(path);
			}
		});
	};

	/**
	 * Link the object files.
	 * @param  {...string} object_files Path to object files.
	 */
	glob["link"] = async function(...object_files) {
		await this.shell(`${this.variables.LD} ${this.variables.LD_FLAGS} ${object_files.join(' ')}`)
	};

	/**
	 * Run the `cargo` command.
	 * @param  {...string} args Arguments.
	 */
	glob["cargo"] = async function (...args) {
		await this.shell(`${glob.variables.CARGO} ${args.join(' ')}`);
	};

	/**
	 * Run the `rustc` command.
	 * @param  {...string} args Arguments.
	 */
	glob["rustc"] = async function (...args) {
		await this.shell(`${glob.variables.RUSTC} ${args.join(' ')}`);
	};

	/**
	 * Run the `rustup` command.
	 * @param  {...string} args Arguments.
	 */
	glob["rustup"] = async function (...args) {
		await this.shell(`${glob.variables.RUSTUP} ${args.join(' ')}`);
	};

	/**
	 * Run the `java` command.
	 * @param  {...string} args Arguments.
	 */
	glob["java"] = async function (...args) {
		await this.shell(`${glob.variables.JAVA} ${args.join(' ')}`);
	};

	/**
	 * Run the `javac` command.
	 * @param  {...string} args Arguments.
	 */
	glob["javac"] = async function (...args) {
		await this.shell(`${glob.variables.JAVAC} ${args.join(' ')}`);
	};
	// Rust support.
	// glob["rust"] = {
		
	// };
	return glob;
})();