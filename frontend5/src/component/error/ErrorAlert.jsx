import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function ErrorAlert({ error, severity = "error" }) {
  const isBackendError = error?.response?.data?.code && error?.response?.data?.message;

  if (!isBackendError) return null;

  const { code, message, timestamp, details } = error.response.data;

  return (
    <Alert severity={severity} style={{ marginTop: 16 }}>
      <AlertTitle>Błąd: {code}</AlertTitle>
      <div>{message}</div>
      <div style={{ fontSize: "0.8rem", marginTop: 4, color: "#666" }}>
        Wystąpił: {timestamp}
      </div>
      {details && (
        <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
          Szczegóły: {details}
        </div>
      )}
    </Alert>
  );
}