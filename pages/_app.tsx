import { Container } from "@mui/material";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container maxWidth={false}>
      <Component {...pageProps} />
    </Container>
  );
}
