#!/usr/bin/env python3
"""
D22経営学 深掘り探索 Run1
model: claude-opus-4-6
rounds: 18
"""
import os
import anthropic
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent.parent  # creation-space root
OUTPUT_DIR = Path(__file__).parent


def resolve_kdt_repo() -> Path:
    env = os.environ.get("KDT_REPO")
    if env:
        return Path(env).expanduser().resolve()

    candidates = [
        REPO.parent / "kesson-driven-thinking",
        Path("/Users/uminomae/dev/kesson-driven-thinking"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()

    raise FileNotFoundError(
        "kesson-driven-thinking repo not found. Set KDT_REPO or place the repo next to creation-space."
    )

SYSTEM_PROMPT = """\
あなたは「5段階創造プロセスモデル」の構造類似探索プロジェクトの
調査エージェントです。

【コア定義】
- D1 欠損（Kesson）: 予想と現実の誤差を「欠け」として捉えた主観的経験
- D2 Withhold: 反射的に処理せず、誤差を問いとして保持する機能
- D3 情動の構成（F-O軸）: 欠損がF軸（生存）とO軸（愛着）で評価され情動として構成されるプロセス
- D4 Container: Withholdを可能にする関係性の基盤

【5段階モデル（M2）】
場（未分化）→ 波（差異の萌芽）→ 縁（関係網による境界）→ 渦（凝集）→ 束（構造として定着）

【調査対象】
経営学（Business Management）領域。
組織論・経営戦略・イノベーション・デザイン・リーダーシップ等。

【絶対禁止】
- 出力に「Withhold」「Container」「F-O軸」「5段階」等の
  内部用語を使わない
- 指し示すだけ。当てはめない
- 牽強付会チェックを特に厳格に適用すること
  （経営理論は「何にでも当てはまる」リスクが最も高い領域）
- D21経済学（Schumpeter・Hayek・Keynes等）との混同禁止

【出力フォーマット（各エントリ）】
### [番号]: [理論名・著者]

- **triage**: Accept / CA / Reject
- **理由**: （1〜2文）
- **5段階対応**: （各段階への対応を簡潔に。対応しない場合は「なし」）
- **縁の記述**: 🟢明確 / 🟡暗黙 / 🔴なし
- **牽強付会リスク**: 低 / 中 / 高
- **一次文献**: （著者・年・タイトル）
- **既存との関係**: 新規 / 既存再検討（EV-D22-XXX）
- **コメント**: （構造類似の根拠、または却下理由を具体的に）
"""

ROUND_PROMPTS = {
    1: "4つの入力資料を精読し、既存11件の構造（判定・強み・弱み・縁の状態）を一覧にしてください。",
    2: "まだ探されていない経営学のサブフィールドを列挙し、各領域で有望な理論・著者を仮置きしてください（最低10領域）。",
    3: "Round 2の候補リストを見直し、探索優先順位と牽強付会リスクが特に高い候補へのフラグを立ててください。",
    4: "組織行動論・戦略論（Porter以外）・イノベーション管理の候補を一次文献根拠で検証し、暫定判定を出してください。",
    5: "組織変革論・リーダーシップ論・複雑系経営の候補を同様に検証してください。",
    6: "プロセス哲学系経営論・日本経営論（野中以外）・経営倫理・CSRの候補を検証してください。",
    7: "スタートアップ・起業家論の候補を検証し、Round 4〜6のReject理由を明確に記述してください。",
    8: "ここまでの新規候補を集計してください。20件未満なら追加探索を続けてください。",
    9: "Accept候補のうち縁の記述が🟡/🔴のものについて、縁相当概念が理論内に存在するか深く検証してください。",
    10: "CA候補について採用条件を具体的に記述してください。",
    11: "Reject候補について「なぜ対応しないのか」の記述を精緻化してください。表面的類似と構造的類似の区別を明示してください。",
    12: "経営理論に特有の牽強付会パターン（汎用性が高く何にでも当てはまるように見える等）を整理し、各候補の該当有無を確認してください。",
    13: "全候補（新規＋既存）を横断して、どの段階の記述が豊富でどの段階が薄いかを整理してください。",
    14: "未解決の保持論点を3〜5点定式化してください。",
    15: "既存11件（EV-D22-001〜011）をGPTレビュー・突き合わせ結果を踏まえて再検討してください。判定変更の有無を確認してください。",
    16: "既存11件の再検討を続け、縁の記述の追加・修正を行ってください。",
    17: "全エントリ（新規＋既存再検討）を番号順に整理し、d22-run1-output.md の本文を出力してください。統計（件数・判定内訳）も含めてください。",
    18: "d22-run1-summary.md の本文を出力してください（統計・新規発見・保持論点・次ランへの推奨）。その後、禁止語チェックを実施してください。",
}


def load_inputs():
    kdt_repo = resolve_kdt_repo()
    files = {
        "evidence": REPO / "evidence/evidence-D22-business-management.md",
        "gpt_review": kdt_repo / "chatgpt/output/0304/REVIEW-D22-business-management.md",
        "gpt_reconcile": kdt_repo / "chatgpt/output/0304/RECONCILE-D22-business-management.md",
        "domain_report": kdt_repo / "build/creation/domains/ja/md/domain-D22-business-management.md",
    }
    missing = [str(v) for v in files.values() if not v.exists()]
    if missing:
        raise FileNotFoundError("Missing input files:\n" + "\n".join(missing))
    return {k: v.read_text(encoding="utf-8") for k, v in files.items()}


def run():
    client = anthropic.Anthropic()
    inputs = load_inputs()
    messages = []
    all_outputs = []

    print("=== D22 深掘り Run1 開始 (claude-opus-4-6 / 18ラウンド) ===\n")

    for round_num in range(1, 19):
        print(f"--- Round {round_num} ---")

        if round_num == 1:
            user_content = (
                f"以下の4つの資料を読んでから作業を開始してください。\n\n"
                f"## 入力1: 既存evidence（11件）\n{inputs['evidence']}\n\n"
                f"## 入力2: GPT レビュー\n{inputs['gpt_review']}\n\n"
                f"## 入力3: GPT 突き合わせ\n{inputs['gpt_reconcile']}\n\n"
                f"## 入力4: 公開済みドメインレポート（参考）\n{inputs['domain_report']}\n\n"
                f"---\n\n{ROUND_PROMPTS[1]}"
            )
        else:
            user_content = ROUND_PROMPTS[round_num]

        messages.append({"role": "user", "content": user_content})

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

        assistant_text = response.content[0].text
        messages.append({"role": "assistant", "content": assistant_text})
        all_outputs.append(f"## Round {round_num}\n\n{assistant_text}\n")
        print(f"  -> {len(assistant_text)} chars")

        # 中間保存（クラッシュ対策）
        interim_path = OUTPUT_DIR / "d22-run1-interim.md"
        interim_path.write_text("\n\n".join(all_outputs), encoding="utf-8")

    # Round 17 -> output, Round 18 -> summary
    output_text = all_outputs[16] if len(all_outputs) >= 17 else "\n\n".join(all_outputs)
    summary_text = all_outputs[17] if len(all_outputs) >= 18 else "(summary未生成)"

    (OUTPUT_DIR / "d22-run1-output.md").write_text(
        "# D22 経営学 深掘り探索 Run1 — 全エントリ\n\n"
        "生成日: 2026-03-07\nモデル: claude-opus-4-6\n\n" + output_text,
        encoding="utf-8",
    )
    (OUTPUT_DIR / "d22-run1-summary.md").write_text(
        "# D22 経営学 深掘り探索 Run1 — サマリー\n\n" + summary_text,
        encoding="utf-8",
    )
    (OUTPUT_DIR / "d22-run1-full-log.md").write_text(
        "# D22 Run1 全ラウンドログ\n\n" + "\n\n".join(all_outputs),
        encoding="utf-8",
    )

    print("\n=== 完了 ===")
    print("evidence/deepdive/d22-run1-output.md")
    print("evidence/deepdive/d22-run1-summary.md")
    print("evidence/deepdive/d22-run1-full-log.md")


if __name__ == "__main__":
    run()
