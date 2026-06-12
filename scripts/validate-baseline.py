#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
踏歌行智策通 — 基线校验脚本 V1.2（稳定版）
用法：python validate-baseline.py <项目根目录>
"""

import sys, os, json, re

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ── 常量 ────────────────────────────────────────────────────────────────

EXPECTED_PAGES = [
    "pages/s1-cover/index",
    "pages/s2-identity/index",
    "pages/s3-intro/index",
    "pages/s4-guide/index",
    "pages/w1-land/index",
    "pages/w2-resource/index",
    "pages/w3-policy/index",
    "pages/w4-market/index",
    "pages/w5-redline/index",
    "pages/w6-swot/index",
    "pages/w7-demand/index",
    "pages/w8-position/index",
    "pages/w9-result/index",
]

W_PAGES = [
    "w1-land","w2-resource","w3-policy","w4-market",
    "w5-redline","w6-swot","w7-demand","w8-position","w9-result"
]

EXPECTED_JS_NAV = {
    "s4-guide":   "/pages/w1-land/index",
    "w1-land":     "/pages/w2-resource/index",
    "w2-resource": "/pages/w3-policy/index",
    "w3-policy":   "/pages/w4-market/index",
    "w4-market":   "/pages/w5-redline/index",
    "w5-redline":  "/pages/w6-swot/index",
    "w6-swot":     "/pages/w7-demand/index",
    "w7-demand":   "/pages/w8-position/index",
    "w8-position":  "/pages/w9-result/index",
}

# ── 工具函数 ─────────────────────────────────────────────────────────────

def read_file(path):
    for enc in ("utf-8", "gb18030", "gbk"):
        try:
            with open(path, "r", encoding=enc) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()

def rel(path, root):
    return os.path.relpath(path, root).replace("\\", "/")

def ok(msg):  print(f"  [OK] {msg}")
def fail(msg): print(f"  [FAIL] {msg}")
def warn(msg): print(f"  [WARN] {msg}")

# ── 检查函数 ─────────────────────────────────────────────────────────────

def check_dirs(root):
    print("\n>> 检查一：目录结构")
    errs, ws = [], []
    pdir = os.path.join(root, "pages")
    if not os.path.isdir(pdir):
        return ["pages/ 目录不存在"], []
    actual = sorted(d for d in os.listdir(pdir) if os.path.isdir(os.path.join(pdir, d)))
    expected = [p.split("/")[-2] for p in EXPECTED_PAGES]
    for d in actual:
        if d not in expected:
            errs.append(f"多余目录：pages/{d}/（历史残留）")
    for d in expected:
        if d not in actual:
            errs.append(f"缺失目录：pages/{d}/")
    for d in actual:
        nested = os.path.join(pdir, d)
        for s in os.listdir(nested):
            if os.path.isdir(os.path.join(nested, s)):
                errs.append(f"嵌套目录：pages/{d}/{s}/（回归#7）")
    if not errs:
        ok("目录结构正确，无历史残留")
    return errs, ws


def check_app_json(root):
    print("\n>> 检查二：app.json")
    errs, ws = [], []
    path = os.path.join(root, "app.json")
    if not os.path.isfile(path):
        return ["app.json 不存在"], []
    try:
        data = json.loads(read_file(path))
        actual = data.get("pages", [])
    except Exception as e:
        return [f"app.json 解析失败：{e}"], []
    for i, exp in enumerate(EXPECTED_PAGES):
        if i >= len(actual):
            errs.append(f"app.json pages 缺失第{i+1}项：{exp}")
            continue
        if actual[i] != exp:
            errs.append(f"app.json pages[{i}] 错误：{actual[i]}（期望：{exp}）")
    if len(actual) > len(EXPECTED_PAGES):
        for ex in actual[len(EXPECTED_PAGES):]:
            errs.append(f"app.json pages 多余项：{ex}（回归#6）")
    if not errs:
        ok("app.json pages 数组正确")
    return errs, ws


def check_wxml(root):
    print("\n>> 检查三：WXML 步骤条")
    errs, ws = [], []
    for p in W_PAGES:
        f = os.path.join(root, "pages", p, "index.wxml")
        if not os.path.isfile(f):
            errs.append(f"文件不存在：pages/{p}/index.wxml")
            continue
        content = read_file(f)
        if "认证" in content:
            sv = re.search(r"<scroll-view[^>]*>.*?</scroll-view>", content, re.DOTALL)
            if sv and "认证" in sv.group(0):
                errs.append(f"pages/{p} 步骤条含'认证'（回归#2）")
            else:
                ws.append(f"pages/{p} 含'认证'文字（不在步骤条内，请人工确认）")
        if "W1 认证" in content or "W1认证" in content:
            errs.append(f"pages/{p} W1 显示为'认证'（回归#3）")
        ws_in_content = set(re.findall(r"W\d", content))
        if len(ws_in_content) > 9:
            errs.append(f"pages/{p} 检测到 >9 个 W 步骤（应为 9 步）")
    if not errs:
        ok("所有 WXML 步骤条正确（9步，无认证）")
    return errs, ws


def check_js_nav(root):
    print("\n>> 检查四：JS 跳转路径")
    errs, ws = [], []
    for page, exp_target in EXPECTED_JS_NAV.items():
        f = os.path.join(root, "pages", page, "index.js")
        if not os.path.isfile(f):
            errs.append(f"文件不存在：pages/{page}/index.js")
            continue
        content = read_file(f)
        pts = re.findall(r"(?:navigateTo|redirectTo|reLaunch)\s*\(\s*\{[^}]*url\s*:\s*['\"]([^'\"]+)['\"]", content)
        if not pts:
            ws.append(f"pages/{page}/index.js 未找到跳转代码（请人工确认）")
            continue
        if not any(exp_target in t or t.endswith(exp_target) for t in pts):
            errs.append(f"pages/{page} 跳转目标错误：{pts}（期望含：{exp_target}）")
    if not errs:
        ok("所有 JS 跳转路径正确")
    return errs, ws


def check_s4(root):
    print("\n>> 检查五：s4-guide timelineSteps")
    errs, ws = [], []
    f = os.path.join(root, "pages", "s4-guide", "index.js")
    if not os.path.isfile(f):
        return ["s4-guide/index.js 不存在"], []
    content = read_file(f)
    steps = re.findall(r"step\s*:\s*\d+", content)
    if len(steps) == 0:
        errs.append("s4-guide 未找到 timelineSteps（请人工确认）")
    elif len(steps) != 9:
        errs.append(f"s4-guide timelineSteps 长度 = {len(steps)}（应为 9，回归#1）")
    idx_tl = content.find("timelineSteps")
    if idx_tl != -1:
        snippet = content[idx_tl:idx_tl+3000]
        if "认证" in snippet:
            errs.append("s4-guide timelineSteps 含'认证'（回归#2）")
    if "W1 地块框选" not in content and "W1 地块" not in content:
        errs.append("s4-guide W1 不是'地块框选'（回归#3）")
    if not errs:
        ok("s4-guide timelineSteps 正确（9步，无认证）")
    return errs, ws


def check_residue(root):
    print("\n>> 检查六：残留文件扫描（w10 / .bak / 嵌套目录）")
    errs, ws = [], []
    pages_root = os.path.join(root, "pages")

    # 6a. w10-result 残留
    for r, ds, fs in os.walk(pages_root):
        for fn in fs:
            if fn.endswith((".js",".json",".wxml",".wxss")):
                fp = os.path.join(r, fn)
                try:
                    c = read_file(fp)
                    if "w10-result" in c or "w10_result" in c:
                        errs.append(f"{rel(fp,root)} 含 w10-result 残留（回归#6）")
                except Exception:
                    pass

    # 6b. .bak / .bak2 文件
    for r, ds, fs in os.walk(pages_root):
        for fn in fs:
            if fn.endswith(".bak") or fn.endswith(".bak2"):
                ws.append(f"备份文件（建议删除）：{rel(os.path.join(r,fn), root)}")

    # 6c. 嵌套目录
    for r, ds, fs in os.walk(pages_root):
        for d in ds:
            if d.startswith("bak_") or "w10" in d:
                errs.append(f"嵌套目录（回归#7）：{rel(os.path.join(r,d), root)}")

    if not errs and not ws:
        ok("无 w10-result 残留，无异常备份文件")
    return errs, ws


# ── 主流程 ────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    root = sys.argv[1].rstrip("/\\")
    print("=" * 60)
    print("踏歌行智策通 — 基线校验脚本 V1.2")
    print(f"项目目录：{root}")
    print("=" * 60)

    all_errs, all_warns = [], []

    for fn in [check_dirs, check_app_json, check_wxml, check_js_nav, check_s4, check_residue]:
        es, ws = fn(root)
        all_errs += es
        all_warns += ws

    print(f"\n{'='*60}")
    print("校验结果汇总")
    print(f"{'='*60}")

    if all_errs:
        print(f"\n[FAIL] 发现 {len(all_errs)} 个错误（禁止发布！）\n")
        for e in all_errs:
            print(f"  [FAIL] {e}")
    else:
        print("\n[OK] 所有检查通过，无错误！")

    if all_warns:
        print(f"\n[WARN] 发现 {len(all_warns)} 个警告（请人工确认）\n")
        for w in all_warns:
            print(f"  [WARN] {w}")

    print(f"\n{'='*60}")
    if all_errs:
        print("[FAIL] 结论：基线校验失败，请修复后重新检查")
        sys.exit(1)
    else:
        print("[OK] 结论：基线校验通过，可以发布")
        sys.exit(0)

if __name__ == "__main__":
    main()
