# Claudecky

Decky plugin: a Quick Access toggle that starts/stops `claude remote-control` on the Steam Deck,
so you can drive Claude Code sessions on the Deck from the Claude app or claude.ai/code without leaving Game Mode.
The panel shows the connect link and a QR code to scan with your phone.

**What this gives away:** while the toggle is on, your claude.ai account can start Claude Code sessions
on the Deck that read, edit and run files as `deck`. Turn it off when you're done.

## Requirements

- [Decky Loader](https://decky.xyz) 3.x
- [Claude Code](https://code.claude.com) installed for `deck` at `~/.local/bin/claude`, logged in with a subscription
- `tmux` (ships with SteamOS)

## One-time setup

Remote Control asks two questions on first run, and the panel has no way to answer them. Answer them once from a terminal:

```sh
mkdir -p ~/projects && cd ~/projects
claude remote-control    # answer "y" to trust the folder and to enable Remote Control, then Ctrl+C
```

Sessions start in `~/projects`. Your home folder won't work: Claude Code never remembers trust for `~`, so it would ask on every start.

## Install

Build `claudecky.zip` (below), copy it to the Deck,
then in Game Mode: Decky → Settings → Developer → install from ZIP file.

## Use

Quick Access (`…`) → Claudecky → Remote Control on. When it says "Connected", scan the QR code
or open the Code tab in the Claude app. Turning it off stops the server and its sessions.

The server runs in a tmux session `claude-rc`. From Desktop Mode or SSH, `tmux attach -t claude-rc`
shows what it's doing (detach with `Ctrl-b d`). Plugin logs are in `~/homebrew/logs/claudecky/`.

## Build

Needs Node and pnpm, e.g. in a distrobox so SteamOS stays untouched:

```sh
pnpm install && pnpm build
mkdir -p /tmp/pkg/claudecky && cp -r dist main.py plugin.json package.json LICENSE /tmp/pkg/claudecky/
(cd /tmp/pkg && python3 -m zipfile -c "$OLDPWD/claudecky.zip" claudecky)
```

Or copy straight into Decky's plugin folder (root-owned) with `sudo ./install.sh`.

## License

BSD-3-Clause, see [LICENSE](LICENSE).
