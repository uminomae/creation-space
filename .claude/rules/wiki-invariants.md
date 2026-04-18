# wiki 不変条件・1:1 原則（cs#225 / cs#226 / cs#227）

cs 側の原典（manifest）と wiki（解説ページ）、および pd 側 wiki との整合を保つ基本ルール。

## 1. 「原典 → wiki 1:1」原則

### cs side

cs `knowledge/raw/manifest.md` の各行のうち、以下を**すべて**満たすものには対応する cs wiki ページが存在しなければならない。

- `access_status` ∈ { `raw-confirmed`, `url-verified` }
- `domain_id` が `D\d+` パターン（`citation-only` / `blocked-access` は対象外）

対応 wiki ページ:

```
cs/knowledge/wiki/D{NN}/{source_id}_{slug}.md
```

例: `D27-S10` → `cs/knowledge/wiki/D27/D27-S10_schumacher-2008.md`

### pd side

同じ manifest 行に対し、pd でも原典解説ページを生成する。

```
pd/wiki/sources/D{NN}_{author}_{year}_{slug}.md
```

（命名規則詳細は `project-design/.claude/skills/wiki-compile/SKILL.md` を参照）

### 検知機構

| 層 | hook / script | 役割 |
|---|---|---|
| cs SessionStart | `cs/.claude/hooks/wiki-gen-check.sh` | cs manifest → cs wiki 未生成を `.cache/inbox/cs-wiki-gen-{date}.md` に書き出す |
| cs PostToolUse | `cs/.claude/hooks/wiki-gen-notify.sh` | cs commit で (A) raw PDF 追加 / (B) cs wiki 改訂を pd `.cache/inbox/` に通知 |
| pd SessionStart | `project-design/.claude/hooks/wiki-gen-check.sh` | cs manifest → pd wiki 未生成を pd `.cache/inbox/wiki-gen-{date}.md` に書き出す |
| 手動検査 | `bash scripts/validate-manifest-sync.sh` | Check 6 (cs ≥5) / Check 7 (pd ≥5, WARN) を実行 |

## 2. 「各領域 wiki ≥5 本」不変条件

cs 側の 30 領域すべてで、`D{NN}-S{##}_*.md` 形式の wiki ページが **5 本以上**存在しなければならない。

- **FAIL 判定**: `bash scripts/validate-manifest-sync.sh` の **Check 6** で FAIL
- **閾値**: 5（タクソノミー整合、progress_level 問わず固定）
- **pd 側**: 同じ 5 本/領域を目標とするが未達は WARN（**Check 7**）。`pd/wiki/sources/` に 0 本の未配備領域は WARN 対象外

## 3. 「wiki 改訂 → 関連ページ同時更新」

cs wiki を改訂するコミットでは、以下の関連ページのうち該当するものを**同一コミット内で**更新する。

- `knowledge/wiki/D{NN}/D{NN}-summary.md` — 領域サマリ
- 関連 `evidence/evidence-D{NN}-*.md` — 5 段階モデル上の位置付けに影響があるとき
- `knowledge/wiki/cross-refs/` や領域跨ぎ参照ドキュメント — 接続が変わったとき

分離コミットは中間状態での整合崩れを生むので避ける。手動で漏らさないよう、`wiki-gen-notify.sh` の (B) ルート通知（pd inbox）を確認する運用とする。

## 4. 違反時の扱い

| 違反 | 検知 | 対処 |
|---|---|---|
| cs wiki 未生成（raw-confirmed / url-verified） | cs hook `wiki-gen-check.sh` SessionStart で inbox 起票 | inbox の依頼順に生成。`knowledge/wiki/D{NN}/{source_id}_*.md` を作成してコミット |
| 領域 wiki <5 本 | `validate-manifest-sync.sh` Check 6 FAIL | 原典を追加して wiki を生成する（manifest に url-verified or raw-confirmed を追加→hook が検知→wiki 生成） |
| pd wiki 未生成 | pd hook / Check 7 WARN | pd 側 `wiki-compile` skill で生成（pd repo の作業） |
| wiki 改訂で関連更新漏れ | code review / pd inbox | 追加コミットで補完し、理由を commit message に明記 |

## 5. pd 側の品質チェック（参照のみ）

pd は cs raw PDF から `wiki/sources/` を独立生成するが、**生成後に cs wiki (`knowledge/wiki/D{NN}/D{NN}-S{##}_*.md`) との内容矛盾検査**を行う（pd#82）。

- 検査スクリプト: `project-design/scripts/wiki-cross-check.mjs`
- 検査手順: `project-design/.claude/skills/wiki-compile/SKILL.md` Step 3b「生成後チェック」
- cs 側の義務ではない（cs 側の矛盾起票は pjdhiro 判断で cs Issue に振り分け）

## 6. 関連 Issue

- cs#225 — 乖離診断と原則の確立（closed）
- cs#226 — cs hook 拡張（wiki-gen-check.sh 新設）
- cs#227 — 本ルール文書化 + validate Check 6/7 追加（一部 cs#228 で撤回予定）
- cs#228 — cs/pd 役割分離原則の明文化 + 命名是正（OPEN）
- pd#82 — wiki 品質チェック: pd wiki ↔ cs wiki 矛盾検査
