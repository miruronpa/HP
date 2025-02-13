// server.js
const express = require('express');
const multer  = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// publicフォルダを静的ファイルとして公開
app.use(express.static('public'));

// アップロード先のディレクトリを設定（なければ作成）
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDir('public/uploads/original');
ensureDir('public/uploads/thumbs');

// Multerのストレージ設定
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/original/');
  },
  filename: function(req, file, cb) {
    // ユニークなファイル名を生成（タイムスタンプ＋ランダム値）
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 管理画面（admin.html）を返す
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ファイルアップロード用エンドポイント
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const originalPath = req.file.path;
    const thumbPath = 'public/uploads/thumbs/' + req.file.filename;

    // Sharpを使ってサムネイル（幅200px程度）を生成
    await sharp(originalPath)
      .resize({ width: 200 })
      .toFile(thumbPath);

    // gallery.json に新しい画像情報を追記
    const galleryDataPath = path.join(__dirname, 'public', 'gallery.json');
    let gallery = [];
    if (fs.existsSync(galleryDataPath)) {
      const data = fs.readFileSync(galleryDataPath, 'utf8');
      gallery = data ? JSON.parse(data) : [];
    }
    gallery.push({
      original: '/uploads/original/' + req.file.filename,
      thumb: '/uploads/thumbs/' + req.file.filename,
      uploadedAt: new Date().toISOString()
    });
    fs.writeFileSync(galleryDataPath, JSON.stringify(gallery, null, 2));

    res.json({ success: true, file: req.file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
