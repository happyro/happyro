"""翻译发布命令的参数解析和阶段编排。"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys

from ..merge.models import MergeFailure
from ..merge.paths import ROOT, WORKSPACES, display, resolve
from .promotion import promote
from .runtime import publish
from .stages import run as run_stage
from .state import save, timestamp, write_batch


def paint(value: str, code: str, enabled: bool) -> str:
    return f"\033[{code}m{value}\033[0m" if enabled else value


def help_text(color: bool) -> str:
    title = lambda value: paint(value, "1;36", color)
    section = lambda value: paint(value, "1;33", color)
    command = lambda value: paint(value, "1;32", color)
    example = lambda value: paint(value, "36", color)
    return "\n".join(
        [
            "",
            title("HappyRO 翻译发布编排"),
            "",
            section("用法"),
            f"  {command('python3 tools/translation/release/main.py')} --workspace <name> --batch <name>",
            "",
            section("阶段"),
            "  校验分片 -> 合并 -> 校验 merged -> 编译（kRO） -> 晋级/回写",
            "  所有生成文件都保存在 work/translation-release/<workspace>/<batch>/。",
            "",
            section("示例"),
            example("  python3 tools/translation/release/main.py"),
            example("    --workspace kro-20211105 --batch canonical-20260825-01"),
            "",
            example("  python3 tools/translation/release/main.py"),
            example("    --workspace kro-20211105 --batch canonical-20260825-01"),
            example("    --promote-merged --runtime-root inputs/runtime/kro-20211105/client"),
            example("    --write"),
            "",
            section("选项"),
            "  --workspace NAME         client-server 或 kro-20211105",
            "  --batch NAME             新批次名称；输出目录不能已存在",
            "  --target-root NAME=PATH  目标根目录；每个仓库重复指定一次",
            "  --repo-root NAME=PATH    合并/校验使用的冻结源码根目录；client-server 可重复指定",
            "  --promote-merged         将本批次 merged 晋级到正式 docs merged 目录",
            "  --runtime-root PATH      kRO 运行时客户端根目录，用于回写 LUB/文本",
            "  --write                  所有校验和编译阶段通过后执行发布",
            "  --allow-incomplete       将待处理/阻塞分片使用源内容合并",
            "  --allow-review-findings 允许 merged 审阅告警通过，但仍禁止错误",
            "  --strict-line-count      将译文分片行数变化视为失败",
            "  --no-color               禁用 ANSI 颜色",
            "",
        ]
    ) + "\n"


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    result.add_argument("--workspace", choices=sorted(WORKSPACES), required=True)
    result.add_argument("--batch", required=True)
    result.add_argument("--agents-root", type=Path)
    result.add_argument("--target-root", action="append", default=[], metavar="NAME=PATH")
    result.add_argument("--repo-root", action="append", default=[], metavar="NAME=PATH")
    result.add_argument("--runtime-root", type=Path)
    result.add_argument("--promote-merged", action="store_true")
    result.add_argument("--allow-incomplete", action="store_true")
    result.add_argument("--allow-review-findings", action="store_true")
    result.add_argument("--strict-line-count", action="store_true")
    result.add_argument("--write", action="store_true")
    result.add_argument("--no-color", action="store_true")
    return result


class Pipeline:
    """将现有独立工具按固定顺序串联起来。"""

    def __init__(self, args: argparse.Namespace) -> None:
        if not args.batch or any(char in args.batch for char in "/\\") or args.batch in {".", ".."}:
            raise MergeFailure("--batch must be a simple directory name")
        if args.write and not args.target_root and not args.promote_merged and not args.runtime_root:
            raise MergeFailure("--write requires --target-root, --promote-merged, or --runtime-root")
        if args.runtime_root and args.workspace != "kro-20211105":
            raise MergeFailure("--runtime-root is only supported for kro-20211105")
        if args.repo_root and args.workspace != "client-server":
            raise MergeFailure("--repo-root is only supported for client-server")
        self.args = args
        self.workspace = WORKSPACES[args.workspace]
        self.root = ROOT / "work/translation-release" / args.workspace / args.batch
        if self.root.exists():
            raise MergeFailure(f"release directory already exists: {display(self.root)}")
        self.merged = self.root / "merged/files"
        self.manifest = self.root / "merged/manifest.tsv"
        self.logs = self.root / "logs"
        self.artifacts = self.root / "artifacts"
        self.backup = self.root / "backup/writeback"
        self.state_path = self.root / "STATE.json"
        self.state: dict[str, object] = {
            "workspace": args.workspace, "batch": args.batch, "root": display(self.root),
            "started_at": timestamp(), "write_requested": bool(args.write),
            "status": "running", "stages": {},
        }

    def save(self) -> None:
        save(self.root, self.state_path, self.state)

    def targets(self) -> list[str]:
        if self.args.target_root:
            return self.args.target_root
        if self.args.promote_merged or self.args.runtime_root:
            return []
        if self.args.workspace == "client-server":
            return ["client=repos/happyro-client", "server=repos/happyro-server"]
        return ["client=docs/translation/zh-cn/kro-20211105/merged/files"]

    def command(self, name: str, command: list[str]) -> None:
        run_stage(name, command, ROOT, self.logs, self.state, self.state_path, paint)

    def run(self) -> int:
        self.save()
        agents = resolve(self.args.agents_root) if self.args.agents_root else self.workspace / "agents"
        no_color = ["--no-color"]
        self.command("validate-chunks", [sys.executable, "tools/translation/validate/main.py", "chunks", "--all", "--root", str(agents), *no_color])
        merge_command = [sys.executable, "tools/translation/merge/main.py", "--workspace", self.args.workspace, "--output", str(self.merged), *no_color]
        for repo_root in self.args.repo_root:
            merge_command.extend(["--repo-root", repo_root])
        if self.args.allow_incomplete:
            merge_command.append("--allow-incomplete")
        if self.args.strict_line_count:
            merge_command.append("--strict-line-count")
        self.command("merge", merge_command)
        write_batch(self.manifest, self.args.workspace, self.args.batch, "ready")
        validate_command = [sys.executable, "tools/translation/validate/main.py", "merged", "--all", "--root", str(agents), "--merged-root", str(self.merged), "--merged-manifest", str(self.manifest), "--max-findings", "2000"]
        if self.args.allow_review_findings:
            validate_command.append("--allow-findings")
        for repo_root in self.args.repo_root:
            validate_command.extend(["--repo-root", repo_root])
        validate_command.extend(no_color)
        self.command("validate-merged", validate_command)
        if self.args.workspace == "kro-20211105":
            self.command("build-lua50", [sys.executable, "tools/client/build/lua50/main.py", *no_color, "build", "--input", str(self.merged / "lub"), "--output", str(self.artifacts / "lua50"), "--prepare"])
            self.command("build-lua51", [sys.executable, "tools/client/build/lua51/main.py", *no_color, "build", "--input", str(self.merged / "lub"), "--output", str(self.artifacts / "lua51"), "--prepare"])
        promote(self.args.promote_merged, self.workspace / "merged", self.root, self.merged, self.manifest, self.logs, self.args.write, self.state, self.state_path)
        targets = self.targets()
        if targets:
            writeback = [sys.executable, "tools/translation/writeback/main.py", "--merged-root", str(self.merged), "--manifest", str(self.manifest), "--backup-dir", str(self.backup)]
            for target in targets:
                writeback.extend(["--target-root", target])
            writeback.extend(no_color)
            if self.args.write:
                writeback.append("--write")
            self.command("writeback", writeback)
        else:
            self.state["stages"]["writeback"] = {"status": "skipped", "reason": "no --target-root"}
            self.save()
        publish(self.args.runtime_root, self.artifacts, self.merged, self.root, self.logs, self.args.write, self.state, self.state_path)
        write_batch(self.manifest, self.args.workspace, self.args.batch, "closed" if self.args.write else "ready")
        self.state["status"] = "passed"
        self.state["finished_at"] = timestamp()
        self.state["outputs"] = {"merged": display(self.merged), "manifest": display(self.manifest), "artifacts": display(self.artifacts) if self.args.workspace == "kro-20211105" else None, "backup": display(self.backup)}
        self.save()
        print(f"Release directory: {display(self.root)}")
        print("Completed: " + ("writeback performed" if self.args.write else "dry-run; no target files written"))
        return 0


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv and os.environ.get("NO_COLOR") is None
    if not argv or "--help" in argv or "-h" in argv or set(argv) <= {"--no-color"}:
        sys.stdout.write(help_text(color))
        return 0
    try:
        args = parser().parse_args([item for item in argv if item != "--no-color"])
        return Pipeline(args).run()
    except (MergeFailure, OSError, subprocess.SubprocessError) as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 1
