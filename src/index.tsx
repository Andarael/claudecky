import { PanelSection, PanelSectionRow, ToggleField, staticClasses } from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Status = { running: boolean; url: string | null; screen: string };

const start = callable<[], Status>("start");
const stop = callable<[], Status>("stop");
const status = callable<[], Status>("status");

function Content() {
  const [s, setS] = useState<Status>({ running: false, url: null, screen: "" });

  useEffect(() => {
    status().then(setS);
    const id = setInterval(() => status().then(setS), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          label="Remote Control"
          description={s.running ? (s.url ? "Connected as “deck”" : "Starting…") : "Off"}
          checked={s.running}
          onChange={async (on) => setS(await (on ? start() : stop()))}
        />
      </PanelSectionRow>
      {s.url && (
        <PanelSectionRow>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px", background: "#fff" }}>
            <QRCodeSVG value={s.url} size={180} />
          </div>
        </PanelSectionRow>
      )}
      {s.running && (
        <PanelSectionRow>
          <div style={{ fontSize: "11px", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
            {s.url ?? s.screen}
          </div>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Claudecky",
  titleView: <div className={staticClasses.Title}>Claudecky</div>,
  content: <Content />,
  icon: <span>✳</span>,
}));
