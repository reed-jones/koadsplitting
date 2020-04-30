import svelteServer from "svelte-server";
/**
 * This is a demo file of using svelte-servers
 * programmatic interface. Note the config()
 * call is totally optional, and will have
 * sane defaults if skipped. in the simplest
 * form a server can be spun up with just
 *
 * svelteServer.listen()
 *
 * Here we import our setup file, could inline the
 * options and pass the the config({ ...options })
 * directly instead
 */
import setup from "./setup.js";

svelteServer
  .config(setup) //optional config object. here we are pulling in from setup.js
  .listen(); //
