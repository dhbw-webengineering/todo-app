// app/head.tsx
export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
          `,
        }}
      />
    </>
  );
}