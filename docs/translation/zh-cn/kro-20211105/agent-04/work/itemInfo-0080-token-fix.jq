def tokens: [scan("\\^[0-9A-Fa-f]{6}|<[^>]+>")] | join("");
def strip_tokens: gsub("\\^[0-9A-Fa-f]{6}|<[^>]+>";"");
def align($source):
  . as $target
  | [range(0; ($target|length)) as $i
     | ($source[$i]|tokens) as $st
     | ($target[$i]|tokens) as $tt
     | if $st == $tt then $target[$i] else (($target[$i]|strip_tokens) + $st) end];
.data |= with_entries(
  . as $entry
  | .value.identifiedDescriptionName = align($SOURCE.data[$entry.key].identifiedDescriptionName)
  | .value.unidentifiedDescriptionName = align($SOURCE.data[$entry.key].unidentifiedDescriptionName)
)
