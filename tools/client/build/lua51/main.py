#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))

from tools.client.build.common import Target, execute


TARGETS = (
    Target("MsgString.json", "System/LuaFiles514/MsgString.lub", "SetupMSG"),
    Target("achievement_list.json", "System/achievement_list.lub", "achievement_tbl"),
    Target(
        "OngoingQuestInfoList.json",
        "System/OngoingQuestInfoList.lub",
        "QuestInfoList",
        ("data",),
    ),
    Target(
        "OngoingQuestInfoList_True.json",
        "System/OngoingQuestInfoList_True.lub",
        "QuestInfoList",
        ("data",),
    ),
    Target("RecommendedQuestInfoList.json", "System/RecommendedQuestInfoList.lub", "RecommendedQuestInfoList"),
    Target(
        "RecommendedQuestInfoList_True.json",
        "System/RecommendedQuestInfoList_True.lub",
        "RecommendedQuestInfoList",
    ),
    Target("Towninfo.json", "System/Towninfo.lub", "mapNPCInfoTable", entrypoint="towninfo"),
    Target("itemInfo_true.json", "System/itemInfo_true.lub", "tbl", ("data",)),
    Target("mapInfo_true.json", "System/mapInfo_true.lub", "mapTbl", entrypoint="mapinfo"),
    Target("tipbox.json", "System/tipbox.lub", "tbl"),
)


if __name__ == "__main__":
    raise SystemExit(execute("5.1", TARGETS, sys.argv[1:]))
