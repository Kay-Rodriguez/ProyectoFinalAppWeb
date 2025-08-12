/*import { useEffect, useRef } from 'react';

export default function ChatBotpress() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // 1) script del webchat
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    s1.defer = true;
    document.body.appendChild(s1);

    // 2) script de configuración (cópialo EXACTO desde "Share > Embed code")
    const s2 = document.createElement('script');
    // 👉 Reemplaza esta URL por la tuya (la del segundo <script> que te da Botpress)
    s2.src = 'https://files.bpcontent.cloud/2025/05/20/20250520201125-LAFMIU15.js';
    s2.defer = true;
    document.body.appendChild(s2);

    // 3) abre automáticamente cuando esté listo
    const onReady = () => window.botpress?.open?.();
    window.botpress?.on?.('webchat:ready', onReady);

    return () => {
      try { window.botpress?.reset?.(); } catch (e) {}
      window.botpress?.off?.('webchat:ready', onReady);
      document.body.removeChild(s1);
      document.body.removeChild(s2);
    };
  }, []);

  return (
    <div className="h-[75vh]">
      <div id="webchat-container" style={{ position:'relative', width:'100%', height:'100%' }} />
    </div>
  );
}*/
import { useEffect } from 'react';

export default function ChatBotpress() {
  useEffect(() => {
    // Evita cargar dos veces
    if (!document.getElementById('bp-webchat')) {
      const s = document.createElement('script');
      s.id = 'bp-webchat';
      s.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
      s.async = true;
      s.onload = () => {
        // 👇 Inicializa con TU clientId
        window.botpress.init({
          clientId: '6fc0d586-3ca5-4da7-855c-72374a5f4289',
          configuration: {
            variant: 'soft',
            themeMode: 'light',
            composerPlaceholder: 'Escribe tu mensaje…',
          }
        });
        window.botpress.on('webchat:ready', () => window.botpress.open());
      };
      document.body.appendChild(s);
    } else {
      // Si ya está, solo abre
      window.botpress?.open?.();
    }
    return () => {
      // Limpieza si sales de la página
      try { window.botpress?.close?.(); } catch {}
    };
  }, []);

  return <div className="p-6 text-gray-500">Cargando chatbot…</div>;
}
