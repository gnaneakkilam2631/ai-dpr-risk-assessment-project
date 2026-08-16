import React from "react";
import { useTheme } from "../context/ThemeContext";

type Theme = "dark" | "light";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="w-full min-h-[calc(100vh-64px)]"
      style={{
        color: "var(--app-text)",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            color: "var(--app-text)",
          }}
        >
          Settings
        </h1>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--app-text-secondary)",
          }}
        >
          Customize your AI–DPR Guardian experience.
        </p>
      </div>

      {/* =====================================================
          APPEARANCE CARD
      ===================================================== */}

      <section
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-border)",
          boxShadow:
            theme === "dark"
              ? "0 15px 45px rgba(0,0,0,0.18)"
              : "0 15px 40px rgba(15,23,42,0.06)",
        }}
      >
        {/* Card Header */}

        <div
          className="flex items-center gap-4 px-7 py-6"
          style={{
            borderBottom: "1px solid var(--app-border)",
          }}
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              background: "rgba(33,102,255,0.12)",
              color: "#4b83ff",
            }}
          >
            <span className="text-xl">◐</span>
          </div>

          <div>
            <h2
              className="text-lg font-semibold"
              style={{
                color: "var(--app-text)",
              }}
            >
              Appearance
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--app-text-secondary)",
              }}
            >
              Choose how the entire application looks.
            </p>
          </div>
        </div>

        {/* Theme Selection */}

        <div className="p-7">
          <h3
            className="mb-4 text-sm font-semibold"
            style={{
              color: "var(--app-text)",
            }}
          >
            Display Theme
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ThemeCard
              theme="dark"
              selected={theme === "dark"}
              title="Dark"
              description="Premium dark workspace"
              onClick={() => setTheme("dark")}
            />

            <ThemeCard
              theme="light"
              selected={theme === "light"}
              title="Light"
              description="Clean bright workspace"
              onClick={() => setTheme("light")}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          APPLICATION CARD
      ===================================================== */}

      <section
        className="mt-6 overflow-hidden rounded-2xl border"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-border)",
        }}
      >
        <div
          className="px-7 py-6"
          style={{
            borderBottom: "1px solid var(--app-border)",
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{
              color: "var(--app-text)",
            }}
          >
            Application
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--app-text-secondary)",
            }}
          >
            General application preferences.
          </p>
        </div>

        {/* Animation */}

        <SettingRow
          title="Interface animations"
          description="Use smooth transitions throughout the dashboard."
          enabled={true}
        />

        {/* Compact navigation */}

        <SettingRow
          title="Compact navigation"
          description="Optimize the navigation sidebar for workspace use."
          enabled={false}
        />
      </section>

      {/* =====================================================
          ABOUT CARD
      ===================================================== */}

      <section
        className="mt-6 overflow-hidden rounded-2xl border"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-border)",
        }}
      >
        <div className="flex items-center justify-between px-7 py-6">
          <div>
            <p
              className="font-semibold"
              style={{
                color: "var(--app-text)",
              }}
            >
              AI–DPR Guardian
            </p>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--app-text-secondary)",
              }}
            >
              AI-powered DPR risk assessment platform
            </p>
          </div>

          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(33,102,255,0.1)",
              color: "#4b83ff",
              border: "1px solid rgba(33,102,255,0.2)",
            }}
          >
            v1.0.0
          </span>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   THEME CARD
========================================================= */

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}

function ThemeCard({
  theme,
  selected,
  title,
  description,
  onClick,
}: ThemeCardProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border p-4 text-left"
      style={{
        background: "var(--app-card)",
        borderColor: selected
          ? "#2166ff"
          : "var(--app-border)",
        boxShadow: selected
          ? "0 0 0 1px rgba(33,102,255,0.25), 0 12px 35px rgba(33,102,255,0.10)"
          : "none",
      }}
    >
      {/* Preview */}

      <div
        className="relative h-44 overflow-hidden rounded-xl border"
        style={{
          background: isDark ? "#070d1a" : "#f4f7fb",
          borderColor: isDark ? "#1d2b42" : "#dce4ef",
        }}
      >
        {/* Mini sidebar */}

        <div
          className="absolute bottom-0 left-0 top-0 w-[27%] p-3"
          style={{
            background: isDark ? "#09111f" : "#ffffff",
            borderRight: isDark
              ? "1px solid #1d2b42"
              : "1px solid #dce4ef",
          }}
        >
          <div
            className="mb-4 h-5 w-5 rounded-md"
            style={{
              background: "#2166ff",
            }}
          />

          <div
            className="mb-2 h-1.5 w-[85%] rounded"
            style={{
              background: "#2166ff",
            }}
          />

          <div
            className="mb-2 h-1.5 w-[70%] rounded"
            style={{
              background: isDark
                ? "#334155"
                : "#cbd5e1",
            }}
          />

          <div
            className="mb-2 h-1.5 w-[78%] rounded"
            style={{
              background: isDark
                ? "#334155"
                : "#cbd5e1",
            }}
          />

          <div
            className="h-1.5 w-[60%] rounded"
            style={{
              background: isDark
                ? "#334155"
                : "#cbd5e1",
            }}
          />
        </div>

        {/* Mini dashboard */}

        <div className="ml-[27%] h-full p-3">
          <div
            className="h-2 w-1/2 rounded"
            style={{
              background: isDark
                ? "#334155"
                : "#cbd5e1",
            }}
          />

          <div
            className="mt-5 h-3 w-2/5 rounded"
            style={{
              background: isDark
                ? "#f8fafc"
                : "#0b172a",
            }}
          />

          <div className="mt-5 flex gap-2">
            <MiniCard dark={isDark} />
            <MiniCard dark={isDark} />
            <MiniCard dark={isDark} />
          </div>
        </div>

        {/* Selected indicator */}

        {selected && (
          <div
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              background: "#2166ff",
              color: "white",
            }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Label */}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p
            className="font-semibold"
            style={{
              color: "var(--app-text)",
            }}
          >
            {title}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: "var(--app-text-secondary)",
            }}
          >
            {description}
          </p>
        </div>

        <div
          className="flex h-5 w-5 items-center justify-center rounded-full border-2"
          style={{
            borderColor: selected
              ? "#2166ff"
              : "var(--app-border)",
            background: selected
              ? "#2166ff"
              : "transparent",
            color: "white",
            fontSize: 10,
          }}
        >
          {selected && "✓"}
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   MINI CARD
========================================================= */

function MiniCard({ dark }: { dark: boolean }) {
  return (
    <div
      className="h-12 flex-1 rounded-md border"
      style={{
        background: dark ? "#0c1628" : "#ffffff",
        borderColor: dark ? "#1d2b42" : "#dce4ef",
      }}
    />
  );
}

/* =========================================================
   SETTING ROW
========================================================= */

interface SettingRowProps {
  title: string;
  description: string;
  enabled: boolean;
}

function SettingRow({
  title,
  description,
  enabled,
}: SettingRowProps) {
  return (
    <div
      className="flex items-center justify-between px-7 py-6"
      style={{
        borderBottom: "1px solid var(--app-border)",
      }}
    >
      <div>
        <p
          className="font-medium"
          style={{
            color: "var(--app-text)",
          }}
        >
          {title}
        </p>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--app-text-secondary)",
          }}
        >
          {description}
        </p>
      </div>

      <div
        className="h-6 w-11 rounded-full p-1"
        style={{
          background: enabled
            ? "#2166ff"
            : "var(--app-border)",
        }}
      >
        <div
          className="h-4 w-4 rounded-full bg-white"
          style={{
            transform: enabled
              ? "translateX(20px)"
              : "translateX(0)",
            transition: "transform 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}