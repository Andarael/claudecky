# Claudecky

Decky plugin: a Quick Access toggle that starts/stops `claude remote-control` on the Deck,
so you can open a Claude Code session from the Claude app or claude.ai/code without leaving Game Mode.

- The server runs in a tmux session `claude-rc` (in `~/projects`, a trusted folder; `~` is never trusted persistently).
  Peek at it from Desktop Mode/SSH: `tmux attach -t claude-rc` (detach: `Ctrl-b d`).
- Runs as `deck` (no `_root` flag), never as root.

## Build & install

```sh
distrobox enter dev -- sh -c 'cd ~/projects/claudecky && pnpm install && pnpm build'
./install.sh   # needs sudo: ~/homebrew/plugins is root-owned
```
