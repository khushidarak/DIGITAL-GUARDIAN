import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/analyze";

interface ModelStatus {
  email: boolean;
  transaction: boolean;
  call: boolean;
  url: boolean;
}

const BackendStatus = () => {
  const [online, setOnline] = useState<boolean | null>(null);
  const [models, setModels] = useState<ModelStatus>({ email: false, transaction: false, call: false, url: false });

  useEffect(() => {
    const check = async () => {
      const result = await checkBackendHealth();
      setOnline(result.online);
      setModels({
        email:       result.models.email       ?? false,
        transaction: result.models.transaction ?? false,
        call:        result.models.call        ?? false,
        url:         result.models.url         ?? false,
      });
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  if (online === null) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-50 rounded-xl px-4 py-3 font-mono text-[10px] tracking-[1.5px]"
      style={{
        background: "rgba(6,13,6,0.92)",
        border: `1px solid ${online ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: online ? "#4ade80" : "#f87171",
            boxShadow: online ? "0 0 6px #4ade80" : "0 0 6px #f87171",
          }}
        />
        <span style={{ color: online ? "#4ade80" : "#f87171" }}>
          {online ? "BACKEND ONLINE" : "BACKEND OFFLINE — FALLBACK MODE"}
        </span>
      </div>

      {online && (
        <div className="flex gap-3 pl-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span style={{ color: models.email       ? "#4ade80" : "#f87171" }}>
            {models.email       ? "✓" : "✗"} EMAIL
          </span>
          <span style={{ color: models.transaction ? "#4ade80" : "#f87171" }}>
            {models.transaction ? "✓" : "✗"} FRAUD
          </span>
          <span style={{ color: models.call        ? "#4ade80" : "#f87171" }}>
            {models.call        ? "✓" : "✗"} CALL
          </span>
          <span style={{ color: models.url ? "#4ade80" : "#f87171" }}>
            {models.url ? "✓" : "✗"} URL
          </span>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
