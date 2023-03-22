import { ReactNode } from "react";

type AppProps = {
  children: ReactNode;
};

function App({ children }: AppProps) {
  return (
    <html lang="en">
      <body>
        The app!
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

export { App };
