NATION_TYPE = setmetatable({}, {__index=function() return 0 end})
SERVER_TYPE = setmetatable({}, {__index=function() return 0 end})
ToolTipStyle = setmetatable({}, {__index=function() return '' end})
BitmapButtonList = setmetatable({}, {__index=function() return '' end})
TextList = setmetatable({}, {__index=function() return '' end})
local service = arg[1]
local replay = arg[2]
dofile(service)
require = function() return true end
dofile(replay)
arg[1] = replay
dofile('/tmp/lubdump.lua')
