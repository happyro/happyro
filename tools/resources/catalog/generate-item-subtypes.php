<?php
/** Export the adventure catalog's exact subtype rules for offline inventory filters. */
$root = dirname(__DIR__, 3);
$args = array_slice($argv, 1);
$color = !in_array('--no-color', $args, true);
$args = array_values(array_filter($args, fn ($arg) => $arg !== '--no-color'));
$command = $args[0] ?? null;
if ($command === null || in_array($command, ['--help', '-h'], true)) {
    $c = fn ($code) => $color ? "\033[{$code}m" : '';
    echo "\n{$c('1;36')}HappyRO item subtypes{$c('0')}\n\n{$c('1;33')}Usage{$c('0')}\n  {$c('1;32')}php tools/resources/catalog/generate-item-subtypes.php generate|check [--no-color]{$c('0')}\n\n{$c('1;33')}Examples{$c('0')}\n  {$c('36')}php tools/resources/catalog/generate-item-subtypes.php generate --no-color{$c('0')}\n\n";
    exit(0);
}
if (count($args) !== 1 || !in_array($command, ['generate', 'check'], true)) {
    fwrite(STDERR, "Use generate or check; see --help\n");
    exit(1);
}
$catalog = 'repos/happyro-admin/backend/resources/game-data/items/renewal.json';
$rules = 'repos/happyro-admin/backend/app/Services/GameData/ItemSubtype.php';
require $root.'/'.$rules;
$data = json_decode(file_get_contents($root.'/'.$catalog), true, 512, JSON_THROW_ON_ERROR);
$items = [];
$equipment = [];
foreach ($data['items'] as $id => $item) {
    if (!in_array($item['Type'] ?? null, ['Weapon', 'Armor', 'Card'], true)) continue;
    if (in_array($item['Type'], ['Weapon', 'Armor'], true)) $equipment[$id] = ['jobs' => (object) ($item['Jobs'] ?? ['All' => true])];
    $subtype = App\Services\GameData\ItemSubtype::fromSnapshot($item);
    if ($subtype !== null) $items[$id] = $subtype;
}
ksort($items, SORT_NUMERIC);
$payload = json_encode([
    'sources' => [$catalog => hash_file('sha256', $root.'/'.$catalog), $rules => hash_file('sha256', $root.'/'.$rules)],
    'items' => (object) $items,
    'equipment' => (object) $equipment,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n";
$target = $root.'/repos/happyro-client/src/DB/Items/ItemSubtypes.generated.json';
if ($command === 'generate') {
    if (file_put_contents($target, $payload) === false) exit(1);
} elseif (!is_file($target) || file_get_contents($target) !== $payload) {
    fwrite(STDERR, "Item subtypes are stale; run generate\n");
    exit(1);
}
echo count($items)." item subtypes exported from adventure catalog rules\n";
