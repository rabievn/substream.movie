import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import type { Locale } from "@/lib/i18n";
import { makeStore, type AppStore, type RootState } from "@/store/store";

interface Options extends Omit<RenderOptions, "wrapper"> {
  locale?: Locale;
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

/** Renders with the same providers as the app (i18n + Redux). */
export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const {
    locale = "en",
    preloadedState,
    store = makeStore(preloadedState),
    ...renderOptions
  } = options;
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <I18nProvider locale={locale}>
      <Provider store={store}>{children}</Provider>
    </I18nProvider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
