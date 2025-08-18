import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
