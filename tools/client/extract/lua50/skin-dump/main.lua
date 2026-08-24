NATION_TYPE = setmetatable({}, {__index=function() return 0 end})
SERVER_TYPE = setmetatable({}, {__index=function() return 0 end})
ToolTipStyle = setmetatable({}, {__index=function() return '' end})
BitmapButtonList = setmetatable({}, {__index=function() return '' end})
TextList = setmetatable({}, {__index=function() return '' end})
dofile(arg[1])
local skin = arg[2]
arg[1] = skin
dofile(skin)
dofile('/tmp/lubdump.lua')
