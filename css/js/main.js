/* js/main.js */
document.addEventListener("DOMContentLoaded", function() {
  // 広告ブロッカー検知用のダミー要素を作成
  var adTest = document.createElement('div');
  adTest.className = 'adsbygoogle';
  adTest.style.height = '1px';
  adTest.style.width = '1px';
  adTest.style.position = 'absolute';
  adTest.style.top = '-1000px';
  document.body.appendChild(adTest);

  // 少し待ってから検知（※タイミングは調整可能）
  setTimeout(function() {
    if (adTest.offsetHeight === 0) {
      // 広告ブロッカーが有効の場合、全画面に警告を表示
      document.body.innerHTML = '<div class="adblock-message">このサイトは広告収入で運営されています。サイトを閲覧するには、広告ブロッカーを無効にしてください。</div>';
    }
    // 検知用要素を削除
    document.body.removeChild(adTest);
  }, 100);
});
