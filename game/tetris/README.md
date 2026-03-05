# Tetris (Classic)

純前端經典俄羅斯方塊，無外部套件、無 build，直接開 `tetris/index.html` 就能遊玩。

## 操作
- `←` `→`：左右移動
- `↓`：Soft Drop（每格 +1 分）
- `↑` 或 `X`：順時針旋轉
- `Z`：逆時針旋轉
- `Space`：Hard Drop（每格 +2 分）
- `P`：暫停 / 繼續
- `R`：重新開始
- `Esc`：暫停或回到標題

## 規則
- 棋盤：`10 x 20` 可視區（含 2 列隱藏生成區）
- 方塊：`I O T S Z J L`
- 隨機：`7-bag`（每袋 7 種各一，洗牌後出牌）
- Next：顯示下一顆

## 計分
- 消 1 / 2 / 3 / 4 行：`40 / 100 / 300 / 1200 * (level + 1)`
- Soft Drop：每格 `+1`
- Hard Drop：每格 `+2`
- 每消 `10` 行升 1 級

## 速度
- 由 `main.js` 的 `FALL_CURVE_MS` 控制下落間隔（毫秒），等級越高越快。

## 額外功能
- 牆邊旋轉：含簡化 wall-kick，降低貼牆卡死機率
- Ghost Piece：預設關閉，可用側欄開關啟用
- 狀態：標題、暫停、Game Over
- 動效：短促消行閃白 + 淡出、落地輕微抖動、分數微跳動

## 部署到 GitHub Pages
1. 將 `tetris/` 資料夾推到你的 repo。
2. GitHub Pages 指向該 repo 分支（例如 `main`）。
3. 以 `https://你的網域/tetris/` 開啟即可遊玩。
