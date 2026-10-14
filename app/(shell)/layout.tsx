export { ShellLayout as default } from "@/_app"

// Every page under the shell renders only after the browser-side session (viewer + workspaces) has loaded,
// so navigations into them can't be instant. Each page and the leads layout therefore export
// `instant = false`, which opts them out of Cache Components' dev-time instant-navigation validation.
