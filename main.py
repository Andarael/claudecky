import os
import re
import subprocess

import decky

# Decky's environment is minimal; give tmux/claude what a login shell would.
HOME = decky.DECKY_USER_HOME
os.environ.update(
    HOME=HOME,
    XDG_RUNTIME_DIR="/run/user/1000",
    PATH=f"{HOME}/.local/bin:" + os.environ.get("PATH", "/usr/bin"),
)

SESSION = "claude-rc"
# Trusted folder: ~ is never trusted persistently, so starting there would block on a prompt.
WORKDIR = f"{HOME}/projects"
URL = re.compile(r"https://claude\.ai/code\S*")


def tmux(*args):
    return subprocess.run(["tmux", *args], capture_output=True, text=True, timeout=10)


class Plugin:
    async def start(self):
        if tmux("has-session", "-t", SESSION).returncode != 0:
            tmux("new-session", "-d", "-s", SESSION, "-x", "200", "-y", "50", "-c", WORKDIR,
                 "claude", "remote-control", "--name", "deck")
        return await self.status()

    async def stop(self):
        tmux("kill-session", "-t", SESSION)
        return await self.status()

    async def status(self):
        if tmux("has-session", "-t", SESSION).returncode != 0:
            return {"running": False, "url": None, "screen": ""}
        screen = tmux("capture-pane", "-p", "-J", "-t", SESSION).stdout
        url = URL.search(screen)
        lines = [l for l in screen.splitlines() if l.strip()]
        return {"running": True, "url": url and url.group(0), "screen": "\n".join(lines[-6:])}
