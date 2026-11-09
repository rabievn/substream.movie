/** Applies the saved theme before first paint to avoid a flash of the wrong theme. */
export const THEME_STORAGE_KEY = "theme";

const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
