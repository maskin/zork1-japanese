/**
 * Zork I - Japanese Edition
 * Z-machine interpreter for GitHub Pages
 */

(function() {
    'use strict';

    const output = document.getElementById('game-output');
    const input = document.getElementById('command-input');
    const submitBtn = document.getElementById('submit-btn');

    // Game state
    let zvm = null;
    let gameData = null;
    let commandHistory = [];
    let historyIndex = -1;

    // Japanese translations for common game messages
    const translations = {
        // Introduction and system messages
        'ZORK I: The Great Underground Empire': 'ZORK I: 偉大なる地下帝国',
        'Copyright (c) 1981, 1982, 1983 Infocom, Inc.': 'Copyright (c) 1981, 1982, 1983 Infocom, Inc.',
        'All rights reserved.': '全著作権所有。',
        'ZORK is a registered trademark of Infocom, Inc.': 'ZORKはInfocom, Inc.の登録商標です。',
        'Revision 88 / Serial number 840726': 'リビジョン88 / シリアル番号 840726',

        // Common room names
        'West of House': '家の西側',
        'North of House': '家の北側',
        'South of House': '家の南側',
        'Behind House': '家の裏',
        'Kitchen': 'キッチン',
        'Living Room': 'リビングルーム',
        'Attic': '屋根裏',
        'Forest': '森',
        'Clearing': '空き地',
        'Canyon View': '峡谷の眺め',
        'Rocky Ledge': '岩棚',
        'Canyon Bottom': '峡谷の底',
        'End of Rainbow': '虹の終わり',

        // Common items
        'mailbox': 'メールボックス',
        'leaflet': 'リーフレット',
        'sword': '剣',
        'lamp': 'ランプ',
        'lantern': 'ランタン',
        'brass lantern': '真鍮のランタン',
        'rope': 'ロープ',
        'key': '鍵',
        'egg': '卵',
        'jeweled egg': '宝石の卵',
        'sack': '袋',
        'lunch': 'ランチ',
        'bottle': 'ボトル',
        'water': '水',
        'garlic': 'にんにく',
        'torch': 'たいまつ',
        'knife': 'ナイフ',
        'nasty knife': '危険なナイフ',
        'gold': '金',
        'diamond': 'ダイヤモンド',
        'emerald': 'エメラルド',
        'chalice': '聖杯',
        'coffin': '棺',
        'skeleton': '骸骨',
        'painting': '絵画',
        'canary': 'カナリア',
        'bauble': '宝飾品',
        'coins': 'コイン',
        'bar': 'バー',
        'platinum bar': 'プラチナバー',
        'scarab': 'スカラベ',
        'pot of gold': '金の壺',
        'trunk': 'トランク',
        'figurine': '小像',
        'crystal trident': 'クリスタルトライデント',
        'sceptre': '笏',
        'bracelet': 'ブレスレット',

        // Directions
        'north': '北',
        'south': '南',
        'east': '東',
        'west': '西',
        'up': '上',
        'down': '下',
        'northeast': '北東',
        'northwest': '北西',
        'southeast': '南東',
        'southwest': '南西',

        // Common responses
        'Taken.': '取りました。',
        'Dropped.': '落としました。',
        'Opened.': '開けました。',
        'Closed.': '閉じました。',
        'OK.': 'OK。',
        "I don't understand that.": 'その言葉は理解できません。',
        "You can't see any such thing.": 'そのようなものは見当たりません。',
        "You can't go that way.": 'その方向には行けません。',
        "It is pitch black. You are likely to be eaten by a grue.": '真っ暗闇です。グルーに食べられる可能性があります。',
        "Your lamp is getting dim.": 'ランプが暗くなってきました。',
        "Your lamp has run out of power.": 'ランプの電池が切れました。',
        "You are carrying:": '持ち物：',
        "You are empty-handed.": '何も持っていません。',
        "Score:": 'スコア：',
        "Moves:": '移動回数：'
    };

    // Append text to output with optional class
    function appendOutput(text, className = '') {
        const span = document.createElement('span');
        if (className) {
            span.className = className;
        }
        span.textContent = text + '\n';
        output.appendChild(span);
        output.scrollTop = output.scrollHeight;
    }

    // Append text with Japanese translation hint
    function appendWithTranslation(text) {
        // Check for exact translations
        if (translations[text.trim()]) {
            appendOutput(`${text} 【${translations[text.trim()]}】`);
            return;
        }

        // Otherwise just output the text
        appendOutput(text);
    }

    // Show welcome message
    function showWelcome() {
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
        appendOutput('        🏰 ZORK I へようこそ！', 'system');
        appendOutput('   〜 偉大なる地下帝国への冒険 〜', 'system');
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
        appendOutput('');
        appendOutput('このゲームは1980年にInfocom社が制作した', 'system');
        appendOutput('伝説的なテキストアドベンチャーゲームです。', 'system');
        appendOutput('');
        appendOutput('ヒント: 英語のコマンドでゲームを操作します。', 'system');
        appendOutput('  例: "look" (見る), "north" (北へ移動)', 'system');
        appendOutput('      "take lamp" (ランプを取る)', 'system');
        appendOutput('');
        appendOutput('ゲームを読み込んでいます...', 'system');
        appendOutput('');
    }

    // Load the game file
    async function loadGame() {
        try {
            // Try to load the game file
            const response = await fetch('zork1.z3');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gameData = await response.arrayBuffer();
            appendOutput('ゲームの読み込みが完了しました！', 'system');
            appendOutput('');
            
            // Initialize the Z-machine
            initZMachine();
        } catch (error) {
            console.error('Error loading game:', error);
            appendOutput('ゲームファイルの読み込みに失敗しました。', 'error');
            appendOutput('代わりにシミュレーションモードで起動します。', 'system');
            appendOutput('');
            initSimulation();
        }
    }

    // Initialize Z-machine (if ZVM is available)
    function initZMachine() {
        if (typeof ZVM !== 'undefined') {
            try {
                zvm = new ZVM();
                zvm.prepare(new Uint8Array(gameData), {
                    print: function(str) {
                        appendWithTranslation(str);
                    },
                    read: function(callback) {
                        window.zmCallback = callback;
                    }
                });
                zvm.run();
            } catch (error) {
                console.error('ZVM initialization error:', error);
                initSimulation();
            }
        } else {
            initSimulation();
        }
    }

    // Simulation mode for when ZVM is not available
    let simulationState = {
        location: 'west_of_house',
        inventory: [],
        mailboxOpen: false,
        leafletTaken: false,
        score: 0,
        moves: 0
    };

    const locations = {
        west_of_house: {
            name: 'West of House (家の西側)',
            description: `You are standing in an open field west of a white house, with a boarded front door.
【和訳】あなたは白い家の西側の野原に立っています。正面ドアは板で塞がれています。

There is a small mailbox here.
【和訳】ここに小さなメールボックスがあります。`,
            exits: { north: 'north_of_house', south: 'south_of_house', west: 'forest', east: null },
            items: ['mailbox']
        },
        north_of_house: {
            name: 'North of House (家の北側)',
            description: `You are facing the north side of a white house. There is no door here, and all the windows are boarded up. To the north a narrow path winds through the trees.
【和訳】あなたは白い家の北側に面しています。ここにはドアがなく、すべての窓は板で塞がれています。北に向かって狭い道が木々の間を曲がりくねっています。`,
            exits: { north: 'forest', south: null, west: 'west_of_house', east: 'behind_house' },
            items: []
        },
        south_of_house: {
            name: 'South of House (家の南側)',
            description: `You are facing the south side of a white house. There is no door here, and all the windows are boarded up.
【和訳】あなたは白い家の南側に面しています。ここにはドアがなく、すべての窓は板で塞がれています。`,
            exits: { north: null, south: 'forest', west: 'west_of_house', east: 'behind_house' },
            items: []
        },
        behind_house: {
            name: 'Behind House (家の裏側)',
            description: `You are behind the white house. A path leads into the forest to the east. In one corner of the house there is a small window which is slightly ajar.
【和訳】あなたは白い家の裏にいます。道が東の森へと続いています。家の隅に少し開いた小さな窓があります。`,
            exits: { north: 'north_of_house', south: 'south_of_house', west: null, east: 'forest', enter: 'kitchen' },
            items: []
        },
        kitchen: {
            name: 'Kitchen (キッチン)',
            description: `You are in the kitchen of the white house. A table seems to have been used recently for the preparation of food. A passage leads to the west and a dark staircase can be seen leading upward. A dark chimney leads down and to the east is a small window which is open.

On the table is an elongated brown sack, smelling of hot peppers.
A bottle is sitting on the table.
The glass bottle contains:
  A quantity of water

【和訳】あなたは白い家のキッチンにいます。テーブルは最近食べ物の準備に使われたようです。通路が西に続き、暗い階段が上に続いているのが見えます。暗い煙突が下に続き、東には開いた小さな窓があります。

テーブルの上には唐辛子の匂いがする細長い茶色の袋があります。
ボトルがテーブルの上にあります。
ガラス瓶には水が入っています。`,
            exits: { west: 'living_room', up: 'attic', out: 'behind_house', east: 'behind_house' },
            items: ['sack', 'bottle']
        },
        living_room: {
            name: 'Living Room (リビングルーム)',
            description: `You are in the living room. There is a doorway to the east, a wooden door with strange gothic lettering to the west, which appears to be nailed shut, a trophy case, and a large oriental rug in the center of the room.

Above the trophy case hangs an elvish sword of great antiquity.
A battery-powered brass lantern is on the trophy case.

【和訳】あなたはリビングルームにいます。東にドア、西には奇妙なゴシック文字が書かれた木製のドア（釘で閉じられているようです）、トロフィーケース、そして部屋の中央に大きな東洋風の絨毯があります。

トロフィーケースの上には非常に古いエルフの剣が掛かっています。
電池式の真鍮のランタンがトロフィーケースの上にあります。`,
            exits: { east: 'kitchen', west: null },
            items: ['sword', 'lantern']
        },
        attic: {
            name: 'Attic (屋根裏)',
            description: `This is the attic. The only exit is a stairway leading down. A large coil of rope is lying in the corner.
On a table is a nasty-looking knife.

【和訳】ここは屋根裏です。唯一の出口は下へ続く階段です。隅に大きなロープの束があります。
テーブルの上には危険な見た目のナイフがあります。`,
            exits: { down: 'kitchen' },
            items: ['rope', 'knife']
        },
        forest: {
            name: 'Forest (森)',
            description: `This is a forest, with trees in all directions. To the east, there appears to be sunlight.

【和訳】これは森で、あらゆる方向に木々があります。東には日光が見えます。`,
            exits: { north: 'forest', south: 'forest', east: 'west_of_house', west: 'forest' },
            items: []
        }
    };

    function initSimulation() {
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
        appendOutput('ZORK I: The Great Underground Empire', '');
        appendOutput('Copyright (c) 1981, 1982, 1983 Infocom, Inc.', '');
        appendOutput('All rights reserved.', '');
        appendOutput('ZORK is a registered trademark of Infocom, Inc.', '');
        appendOutput('Revision 88 / Serial number 840726', '');
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
        appendOutput('');
        
        processCommand('look');
    }

    function processCommand(cmd) {
        const command = cmd.toLowerCase().trim();
        if (!command) return;

        simulationState.moves++;
        appendOutput(`> ${cmd}`, 'command');
        appendOutput('');

        const loc = locations[simulationState.location];
        const words = command.split(' ');
        const verb = words[0];
        const noun = words.slice(1).join(' ');

        switch (verb) {
            case 'look':
            case 'l':
                appendOutput(loc.name);
                appendOutput('');
                appendOutput(loc.description);
                break;

            case 'north':
            case 'n':
            case 'south':
            case 's':
            case 'east':
            case 'e':
            case 'west':
            case 'w':
            case 'up':
            case 'u':
            case 'down':
            case 'd':
                const dirMap = { n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down' };
                const direction = dirMap[verb] || verb;
                if (loc.exits[direction]) {
                    simulationState.location = loc.exits[direction];
                    processCommand('look');
                } else {
                    appendOutput("You can't go that way.\n【和訳】その方向には行けません。");
                }
                break;

            case 'enter':
            case 'in':
                if (loc.exits.enter) {
                    simulationState.location = loc.exits.enter;
                    processCommand('look');
                } else {
                    appendOutput("You can't enter here.\n【和訳】ここには入れません。");
                }
                break;

            case 'out':
            case 'exit':
                if (loc.exits.out) {
                    simulationState.location = loc.exits.out;
                    processCommand('look');
                } else {
                    appendOutput("You can't exit here.\n【和訳】ここから出られません。");
                }
                break;

            case 'inventory':
            case 'i':
                if (simulationState.inventory.length === 0) {
                    appendOutput("You are empty-handed.\n【和訳】何も持っていません。");
                } else {
                    appendOutput("You are carrying:\n【和訳】持ち物：");
                    simulationState.inventory.forEach(item => {
                        appendOutput(`  ${item}`);
                    });
                }
                break;

            case 'take':
            case 'get':
                if (!noun) {
                    appendOutput("What do you want to take?\n【和訳】何を取りますか？");
                } else if (noun === 'leaflet' && simulationState.mailboxOpen && !simulationState.leafletTaken) {
                    simulationState.leafletTaken = true;
                    simulationState.inventory.push('leaflet');
                    appendOutput("Taken.\n【和訳】取りました。");
                } else if (loc.items.includes(noun)) {
                    const index = loc.items.indexOf(noun);
                    loc.items.splice(index, 1);
                    simulationState.inventory.push(noun);
                    appendOutput("Taken.\n【和訳】取りました。");
                } else if (noun === 'mailbox') {
                    appendOutput("It is securely anchored.\n【和訳】しっかり固定されています。");
                } else {
                    appendOutput("You can't see any such thing.\n【和訳】そのようなものは見当たりません。");
                }
                break;

            case 'drop':
                if (!noun) {
                    appendOutput("What do you want to drop?\n【和訳】何を置きますか？");
                } else if (simulationState.inventory.includes(noun)) {
                    const index = simulationState.inventory.indexOf(noun);
                    simulationState.inventory.splice(index, 1);
                    loc.items.push(noun);
                    appendOutput("Dropped.\n【和訳】落としました。");
                } else {
                    appendOutput("You're not carrying that.\n【和訳】それは持っていません。");
                }
                break;

            case 'open':
                if (noun === 'mailbox') {
                    if (!simulationState.mailboxOpen) {
                        simulationState.mailboxOpen = true;
                        appendOutput("Opening the small mailbox reveals a leaflet.\n【和訳】小さなメールボックスを開けると、リーフレットが見えます。");
                    } else {
                        appendOutput("It is already open.\n【和訳】すでに開いています。");
                    }
                } else {
                    appendOutput("You can't open that.\n【和訳】それは開けられません。");
                }
                break;

            case 'close':
                if (noun === 'mailbox') {
                    if (simulationState.mailboxOpen) {
                        simulationState.mailboxOpen = false;
                        appendOutput("Closed.\n【和訳】閉じました。");
                    } else {
                        appendOutput("It is already closed.\n【和訳】すでに閉じています。");
                    }
                } else {
                    appendOutput("You can't close that.\n【和訳】それは閉じられません。");
                }
                break;

            case 'read':
                if (noun === 'leaflet' && simulationState.inventory.includes('leaflet')) {
                    appendOutput(`"WELCOME TO ZORK!

ZORK is a game of adventure, danger, and low cunning. In it you will explore some of the most amazing territory ever seen by mortals. No computer should be without one!"

【和訳】「ZORKへようこそ！

ZORKは冒険、危険、そして巧妙な策略のゲームです。このゲームでは、人間が見たことのない驚くべき領域を探検します。どのコンピュータにも一つは必要です！」`);
                } else {
                    appendOutput("There is nothing special to read.\n【和訳】読む価値のあるものは特にありません。");
                }
                break;

            case 'examine':
            case 'x':
                if (noun === 'mailbox') {
                    if (simulationState.mailboxOpen) {
                        if (simulationState.leafletTaken) {
                            appendOutput("The mailbox is open but empty.\n【和訳】メールボックスは開いていますが空です。");
                        } else {
                            appendOutput("The mailbox is open and contains a leaflet.\n【和訳】メールボックスは開いており、リーフレットが入っています。");
                        }
                    } else {
                        appendOutput("The mailbox is small and wooden with a tiny flag attached.\n【和訳】メールボックスは小さな木製で、小さな旗が付いています。");
                    }
                } else if (noun === 'house') {
                    appendOutput("The house is a beautiful colonial house which is painted white. It is clear that the owners have long since deserted it.\n【和訳】家は白く塗られた美しいコロニアル様式の家です。所有者が長い間それを放棄したことは明らかです。");
                } else {
                    appendOutput("You see nothing special about that.\n【和訳】特に目立ったものはありません。");
                }
                break;

            case 'score':
                appendOutput(`Your score is ${simulationState.score} (total of 350 points), in ${simulationState.moves} moves.
This gives you the rank of Beginner.

【和訳】スコア: ${simulationState.score}点（合計350点中）、${simulationState.moves}回の移動。
あなたの階級: 初心者`);
                break;

            case 'save':
                try {
                    localStorage.setItem('zork1_save', JSON.stringify(simulationState));
                    appendOutput("Your position has been saved.\n【和訳】ポジションが保存されました。");
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        appendOutput("Save failed: Storage is full.\n【和訳】保存に失敗しました：ストレージがいっぱいです。");
                    } else if (e.name === 'SecurityError') {
                        appendOutput("Save failed: Storage is disabled.\n【和訳】保存に失敗しました：ストレージが無効です。");
                    } else {
                        appendOutput("Save failed: " + e.message + "\n【和訳】保存に失敗しました。");
                    }
                }
                break;

            case 'restore':
            case 'load':
                try {
                    const saved = localStorage.getItem('zork1_save');
                    if (saved) {
                        simulationState = JSON.parse(saved);
                        appendOutput("Your position has been restored.\n【和訳】ポジションが復元されました。");
                        processCommand('look');
                    } else {
                        appendOutput("No saved game found.\n【和訳】保存されたゲームが見つかりません。");
                    }
                } catch (e) {
                    if (e.name === 'SecurityError') {
                        appendOutput("Restore failed: Storage is disabled.\n【和訳】復元に失敗しました：ストレージが無効です。");
                    } else {
                        appendOutput("Restore failed: " + e.message + "\n【和訳】復元に失敗しました。");
                    }
                }
                break;

            case 'help':
            case 'hint':
                appendOutput(`基本コマンド / Basic Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━
移動 / Movement:
  north (n), south (s), east (e), west (w)
  up (u), down (d), enter, exit

アクション / Actions:
  look (l) - 周りを見る
  inventory (i) - 持ち物を見る
  take [物] - 物を取る
  drop [物] - 物を置く
  open [物] - 開ける
  examine [物] (x) - 調べる
  read [物] - 読む

システム / System:
  save - ゲームを保存
  restore - ゲームを復元
  score - スコアを表示
  help - このヘルプを表示`);
                break;

            case 'quit':
            case 'q':
                appendOutput("Thanks for playing ZORK I!\n【和訳】ZORK Iをプレイしていただきありがとうございます！");
                appendOutput("\nType 'restore' to continue from your last save.\n【和訳】'restore'と入力すると最後のセーブから続けられます。");
                break;

            default:
                appendOutput("I don't understand that.\n【和訳】その言葉は理解できません。");
                appendOutput("Type 'help' for a list of commands.\n【和訳】'help'と入力するとコマンド一覧が表示されます。");
        }

        appendOutput('');
    }

    // Handle command submission
    function submitCommand() {
        const cmd = input.value.trim();
        if (!cmd) return;

        // Add to history
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        // Process command
        if (zvm && window.zmCallback) {
            window.zmCallback(cmd);
        } else {
            processCommand(cmd);
        }

        // Clear input
        input.value = '';
    }

    // Event listeners
    submitBtn.addEventListener('click', submitCommand);

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            submitCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    // Initialize
    showWelcome();
    loadGame();
})();
