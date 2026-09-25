export function installPortableExport() {
  window.STORYBOOK_EXPORT = async (save, customImages = {}) => {
    const pack = { save: save || null, customImages: customImages || {} };
    const json = JSON.stringify(pack)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');
    let html;
    if (!document.querySelector('script[type="module"][src]')) {
      const clone = document.documentElement.cloneNode(true);
      const app = clone.querySelector('#app');
      if (app) app.replaceChildren();
      for (const dialog of clone.querySelectorAll('dialog[open]')) dialog.removeAttribute('open');
      html = '<!doctype html>\n' + clone.outerHTML;
    } else {
      const response = await fetch('./output/storybook-dream.html', { cache: 'no-store' });
      if (!response.ok)
        throw new Error('게임 파일을 준비하지 못했어요. 로컬 HTML 파일에서 다시 시도해 주세요.');
      html = await response.text();
    }
    const marker = /<script id="storybook-save" type="application\/json">[\s\S]*?<\/script>/;
    if (!marker.test(html)) throw new Error('이어서 할 내용을 넣을 수 없는 게임 파일이에요.');
    html = html.replace(marker, () => `<script id="storybook-save" type="application/json">${json}</script>`);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' }),
      url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download = 'storybook-dream-continue.html';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return true;
  };
}
