import { PropsWithChildren } from "react";
import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
