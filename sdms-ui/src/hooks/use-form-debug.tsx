"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { APP_CONFIG } from "@/lib/config/app-config"; // ✅ import global config

// Recursive renderer for JSON with color coding
function RenderDebug({ data }: { data: any }) {
  if (!data) return <div className="text-gray-400">No Data</div>;

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <div className="pl-4 space-y-1">
        {Object.entries(data).map(([key, value]) => {
          const isError = key.toLowerCase().includes("error");
          const textColor = isError
            ? "text-red-500"
            : typeof value === "boolean"
            ? value
              ? "text-green-600"
              : "text-red-600"
            : "text-gray-800";

          return (
            <div key={key}>
              <span className="font-semibold">{key}: </span>
              <span className={textColor}>
                {typeof value === "object" ? (
                  <RenderDebug data={value} />
                ) : (
                  String(value)
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-6">
        {data.map((item, i) => (
          <li key={i}>
            <RenderDebug data={item} />
          </li>
        ))}
      </ul>
    );
  }

  return <span>{String(data)}</span>;
}

export function useFormDebug(form: any) {
  const [debugData, setDebugData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // ✅ Destructure formState so RHF subscribes to changes
  const {
    errors,
    isValid,
    isDirty,
    touchedFields,
    dirtyFields,
    isSubmitting,
    submitCount,
  } = form.formState;

  const getInvalidReasons = () => {
    if (isValid) return [];
    return Object.entries(errors).map(([field, error]: any) => {
      return `${field}: ${error?.message || "Invalid value"}`;
    });
  };

  useEffect(() => {
    setDebugData({
      values: form.getValues(),
      errors,
      isValid,
      isDirty,
      touchedFields,
      dirtyFields,
      isSubmitting,
      submitCount,
    });
  }, [
    form,
    errors,
    isValid,
    isDirty,
    touchedFields,
    dirtyFields,
    isSubmitting,
    submitCount,
  ]);

  const DebugButton = () => (
    <>
      {/* ✅ controlled by APP_CONFIG.debug */}
      {APP_CONFIG.debug && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="mt-2"
          >
            🐞 Show Debug
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Form Debug Info</DialogTitle>
              </DialogHeader>

              {!isValid && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                  <strong>❌ Form is invalid because:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {getInvalidReasons().map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isValid && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md text-green-700 text-sm">
                  ✅ Form is valid!
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-xs font-mono whitespace-pre-wrap break-words">
                <RenderDebug data={debugData} />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );

  return { DebugButton };
}
