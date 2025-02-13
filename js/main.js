document.addEventListener("DOMContentLoaded", function() {
  // 広告ブロッカー検知用のダミー要素を作成
  var adTest = document.createElement('div');
  adTest.className = 'adsbygoogle';
  adTest.style.height = '1px';
  adTest.style.width = '1px';
  adTest.style.position = 'absolute';
  adTest.style.top = '-1000px';
  document.body.appendChild(adTest);

  // 少し待ってから検知
  setTimeout(function() {
    if (adTest.offsetHeight === 0) {
      document.body.innerHTML = '<div class="adblock-message">このサイトは広告収入で運営されています。サイトを閲覧するには、広告ブロッカーを無効にしてください。</div>';
    }
    document.body.removeChild(adTest);
  }, 100);
});
