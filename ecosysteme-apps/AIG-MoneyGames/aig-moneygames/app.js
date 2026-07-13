// ============================================================
// AIG MoneyGames — main app.
// ============================================================

(function () {
  "use strict";

  const G = window.AIGGames;
  const A = window.AIGMGAuth;

  const state = {
    currentUser: null,
    bjState: null,
    rouletteSelection: null,
    kenoPicks: new Set(),
    selectedDemoGame: null,
    otherGameStats: {},
    otherGameActiveSlug: null,
    otherGameSessionStartMs: null
  };
  const el = {};
  [
    "authShell", "appShell", "authError", "loginPanel", "registerPanel",
    "navLobbyBtn", "navLeaderboardBtn", "navDashboardBtn", "balanceDisplay", "signOutBtn", "globalNotice",
    "lobbyView", "lobbyBalance", "lobbyNetChange", "monthLabel",
    "slotsView", "reel0", "reel1", "reel2", "slotsResult", "slotsBetAmount", "slotsBetDown", "slotsBetUp", "slotsSpinBtn", "slotsPaytable", "slotsRtpLink",
    "blackjackView", "dealerCards", "dealerTotal", "playerCards", "playerTotal", "bjResult", "bjBetRow", "bjBetAmount", "bjDealBtn", "bjActionsRow", "bjHitBtn", "bjStandBtn", "bjDoubleBtn",
    "rouletteView", "rouletteResultArea", "rouletteGrid", "rouletteOutsideBets", "rouletteBetAmount", "rouletteSpinBtn", "rouletteSelectionLabel",
    "baccaratView", "baccaratBetChoice", "baccaratBetAmount", "baccaratDealBtn", "baccaratPlayerCards", "baccaratBankerCards", "baccaratTotals", "baccaratResult",
    "kenoView", "kenoGrid", "kenoBetAmount", "kenoDrawBtn", "kenoPicksLabel", "kenoResult",
    "catalogBetAmount", "catalogGrid", "catalogStatus",
    "otherGamesGrid", "otherGameFrame", "otherGamePlaceholder", "otherGameNowPlaying", "otherGameTrailerLink", "otherGameBackToList", "otherGamesTopTime", "otherGamesTopStarts",
    "demoGameView", "demoGameIcon", "demoGameTitle", "demoGameNote", "demoGameBetAmount", "demoGamePlayBtn", "demoGameResult",
    "leaderboardView", "leaderboardPanel"
  ].forEach(id => { el[id] = document.getElementById(id); });

  const demoCatalog = [
    { name: "Neon Fruits", icon: "🍒", cat: "slots", edge: "low", note: "Classic 3-reel fruit" },
    { name: "Jade Reels", icon: "💎", cat: "slots", edge: "medium", note: "High symbol variance" },
    { name: "Golden Sevens", icon: "7️⃣", cat: "slots", edge: "high", note: "Rare bigger pops" },
    { name: "Treasure Bells", icon: "🔔", cat: "slots", edge: "low", note: "Frequent small wins" },
    { name: "Lucky Pyramid", icon: "🛕", cat: "slots", edge: "medium", note: "Volatile bonus style" },
    { name: "Arctic Spins", icon: "🧊", cat: "slots", edge: "high", note: "Cold streak / hot streak" },
    { name: "Turbo Roulette", icon: "🎯", cat: "table", edge: "medium", note: "Fast wheel rounds" },
    { name: "Classic Blackjack", icon: "🃏", cat: "table", edge: "low", note: "Dealer stands 17" },
    { name: "Mini Baccarat", icon: "🀄", cat: "table", edge: "medium", note: "Player / Banker / Tie" },
    { name: "Quick Keno", icon: "🔢", cat: "table", edge: "high", note: "10 of 40 numbers" },
    { name: "Sic Bo Sprint", icon: "🎲", cat: "table", edge: "high", note: "Triple-dice burst" },
    { name: "Dragon Poker", icon: "🐉", cat: "table", edge: "medium", note: "Single-draw style" },
    { name: "Coin Flip", icon: "🪙", cat: "instant", edge: "low", note: "Heads or tails" },
    { name: "Lucky Dice", icon: "🎲", cat: "instant", edge: "medium", note: "Roll for multiplier" },
    { name: "Crash Mini", icon: "📈", cat: "instant", edge: "high", note: "Cash out timing sim" },
    { name: "Plinko Pop", icon: "🟠", cat: "instant", edge: "high", note: "Pegboard bounce sim" },
    { name: "Hi-Lo Card", icon: "🂠", cat: "instant", edge: "medium", note: "Beat the card" },
    { name: "Lucky Wheel", icon: "🎡", cat: "instant", edge: "low", note: "Segment prize wheel" },
  ];

  const otherGames = [
    { name: "Drop Down Bots", slug: "DropDownBots", trailer: "https://youtu.be/7aBXVBLStJI", cover: "assets/other-games/dropdownbots200.webp" },
    { name: "Four Rivers Mahjong", slug: "FourRiversMahjong", trailer: "https://youtu.be/x9Q-IqxrPFU", cover: "assets/other-games/fourriversmahjong200.webp" },
    { name: "Chou Chou Kyodai", slug: "ChouChouKyodai", trailer: "https://youtu.be/mWAC-TmVPis", cover: "assets/other-games/chouchoukyodai200.webp" },
    { name: "Daily Patch It", slug: "DailyPatchIt", trailer: "https://youtu.be/IOpwGooVabY", cover: "assets/other-games/daily-patch-it-200.webp" },
    { name: "Maze Puzzle", slug: "MazePuzzle", trailer: "https://youtu.be/w4qXD2c16wA", cover: "assets/other-games/mazepuzzle200.webp" },
    { name: "Zoo Crush", slug: "ZooCrush", trailer: "https://youtu.be/suPySeO1grY", cover: "assets/other-games/zoocrush200.webp" },
    { name: "Escape Room Hotel Escape", slug: "EscapeRoom-HotelEscape", trailer: "https://youtu.be/qphD5i31370", cover: "assets/other-games/escaperoom-hotelescape200.webp" },
    { name: "Tetrix XL", slug: "TetrixXL", trailer: "https://youtu.be/gXN2BpyHVvE", cover: "assets/other-games/tetrixxl200.webp" },
    { name: "Neon Flip", slug: "NeonFlip", trailer: "https://youtu.be/D7EhmBp0c_g", cover: "assets/other-games/neonflip200.webp" },
    { name: "Country Labyrinth 4", slug: "CountryLabyrinth4", trailer: "https://youtu.be/drHZhZwGlCs", cover: "assets/other-games/countrylabyrinth4200.webp" },
    { name: "10x10 Arabic", slug: "10x10Arabic", trailer: "https://youtu.be/2v9aTf3fzak", cover: "assets/other-games/10x10arabic200.webp" },
    { name: "Mahjong Seasons", slug: "MahjongSeasons", trailer: "https://youtu.be/-geTKDadQn8", cover: "assets/other-games/mahjongseasons200.webp" },
    { name: "Hex Match", slug: "HexMatch", trailer: "https://youtu.be/Xha-uRKDwN4", cover: "assets/other-games/hexmatch200.webp" },
    { name: "Tap It Away 2D", slug: "TapItAway2D", trailer: "https://youtu.be/XZIrQK_gQEw", cover: "assets/other-games/tapitaway2d200.webp" },
    { name: "Lunar Lander", slug: "LunarLander", trailer: "https://youtu.be/SmkNNnru8SQ", cover: "assets/other-games/lunarlander200.webp" },
    { name: "Pyramid Solitaire Ancient Aztec", slug: "PyramidSolitaire-AncientAztec", trailer: "https://youtu.be/CMYBiF5a3Ow", cover: "assets/other-games/pyramidsolitaireancientaztec200.webp" },
    { name: "Mahjong Connect Merge", slug: "MahjongConnectMerge", trailer: "https://youtu.be/ew7u97p5y7E", cover: "assets/other-games/mahjongconnectmerge200.webp" },
    { name: "Connect 3 Easter", slug: "Connect3-Easter", trailer: "https://youtu.be/v7-8opDDEYY", cover: "assets/other-games/connect3-easter200.webp" },
    { name: "Istanbul Hidden Objects", slug: "IstanbulHiddenObjects", trailer: "https://youtu.be/EBLjrerdTsA", cover: "assets/other-games/istanbulhiddenobjects200.webp" },
    { name: "Daily Masyu", slug: "DailyMasyu", trailer: "https://youtu.be/6kUFctX7MhI", cover: "assets/other-games/daily-masyu-200.webp" },
    { name: "Witch World", slug: "WitchWorld", trailer: "https://youtu.be/gbRrsXBUFsA", cover: "assets/other-games/witchworld200.webp" },
    { name: "Diamond Mahjong", slug: "DiamondMahjong", trailer: "https://youtu.be/YiiYBwatuXE", cover: "assets/other-games/diamondmahjong200.webp" },
    { name: "Tri Puzzle", slug: "TriPuzzle", trailer: "https://youtu.be/agm60rT3AqY", cover: "assets/other-games/tripuzzle200.webp" },
    { name: "Bubble Shooter 3D", slug: "BubbleShooter3D", trailer: "https://youtu.be/TfeCu5ld8K8", cover: "assets/other-games/bubbleshooter3D-200.webp" },
    { name: "Spider Match 3", slug: "SpiderMatch3", trailer: "https://youtu.be/MuwfwIeFLLc", cover: "assets/other-games/spidermatch3200.webp" },
    { name: "Huge Mahjong", slug: "HugeMahjong", trailer: "https://youtu.be/mY-KHXzxR2E", cover: "assets/other-games/hugemahjong200.webp" },
    { name: "Gold Mine", slug: "GoldMine", trailer: "https://youtu.be/QxzAEbaQKis", cover: "assets/other-games/goldmine200.webp" },
    { name: "Endless Bubble Shooter", slug: "EndlessBubbleShooter", trailer: "https://youtu.be/57glRYl3py4", cover: "assets/other-games/endlessbubbleshooter200.webp" },
    { name: "Love Hidden Hearts", slug: "LoveHiddenHearts", trailer: "https://youtu.be/zNW4Q6XVNE8", cover: "assets/other-games/lovehiddenhearts200.webp" },
    { name: "Love Mahjong", slug: "LoveMahjong", trailer: "https://youtu.be/a77GrGnpUFc", cover: "assets/other-games/lovemahjong200.webp" },
    { name: "Tile Stack", slug: "TileStack", trailer: "https://youtu.be/COhL3-_3-9s", cover: "assets/other-games/tilestack200.webp" },
    { name: "Tripeaks Mania", slug: "TripeaksMania", trailer: "https://youtu.be/MRUEqb4Ar40", cover: "assets/other-games/tripeaksmania200.webp" },
    { name: "Ocean Treasure", slug: "OceanTreasure", trailer: "https://youtu.be/kBdLlzWrRW8", cover: "assets/other-games/oceantreasure200.webp" },
    { name: "Hunting Jack At The Train Station", slug: "HuntingJackAtTheTrainStation", trailer: "https://youtu.be/nKfuWbudH3U", cover: "assets/other-games/huntingjackatthetrainstation200.webp" },
    { name: "Tetrix 3D", slug: "Tetrix3D", trailer: "https://youtu.be/MNE5Kr82efg", cover: "assets/other-games/tetrix-3d-200.webp" },
    { name: "Daily Path", slug: "DailyPath", trailer: "https://youtu.be/IHWH-TikaPY", cover: "assets/other-games/daily-path-200.webp" },
    { name: "Texas Holdem Poker", slug: "TexasHoldemPoker", trailer: "https://youtu.be/XLIBb8AygMA", cover: "assets/other-games/texasholdempoker200.webp" },
    { name: "Picture Nonogram", slug: "PictureNonogram", trailer: "https://youtu.be/BNS4v3Fv0JU", cover: "assets/other-games/picturenonogram200.webp" },
    { name: "Frozen Bubbles", slug: "FrozenBubbles", trailer: "https://youtu.be/qYsxYNSpYe8", cover: "assets/other-games/frozenbubbles200.webp" },
    { name: "Unlock The King", slug: "UnlockTheKing", trailer: "https://youtu.be/-5RVJsRIiHE", cover: "assets/other-games/unlocktheking200.webp" },
    { name: "Dubai Hidden Objects", slug: "DubaiHiddenObjects", trailer: "https://youtu.be/GCFBUeYmBXs", cover: "assets/other-games/dubaihiddenobjects200.webp" },
    { name: "Memory Puzzle", slug: "MemoryPuzzle", trailer: "https://youtu.be/N4Y1kJTxHTs", cover: "assets/other-games/memorypuzzle200.webp" },
    { name: "Car Match", slug: "CarMatch", trailer: "https://youtu.be/LOTSw7qhl3M", cover: "assets/other-games/carmatch200.webp" },
    { name: "Draw Domino", slug: "DrawDomino", trailer: "https://youtu.be/fsCkSNIQHPc", cover: "assets/other-games/drawdomino200.webp" },
    { name: "Nautilus Mahjong", slug: "NautilusMahjong", trailer: "https://youtu.be/CWaFYHrAY0U", cover: "assets/other-games/nautilusmahjong200.webp" },
    { name: "Bubble Circle", slug: "BubbleCircle", trailer: "https://youtu.be/s5dPjMfze-k", cover: "assets/other-games/bubblecircle200.webp" },
    { name: "Smoothie Connect", slug: "SmoothieConnect", trailer: "https://youtu.be/WLf8pkUy-mU", cover: "assets/other-games/smoothieconnect200.webp" },
    { name: "Daily Number Sums", slug: "DailyNumberSums", trailer: null, cover: "assets/other-games/daily-number-sums-200.webp" },
    { name: "Magic Tiles", slug: "MagicTiles", trailer: "https://youtu.be/T-fLK6GdLv4", cover: "assets/other-games/magictiles200.webp" },
    { name: "Tower Of Hanoi Sort", slug: "TowerOfHanoiSort", trailer: "https://youtu.be/w_440RiERPo", cover: "assets/other-games/towerofhanoisort200.webp" },
    { name: "Block Drop", slug: "BlockDrop", trailer: "https://youtu.be/W31y1Hx0jiI", cover: "assets/other-games/blockdrop200.webp" },
    { name: "Guardian Lighthouse Hidden Secrets", slug: "GuardianLighthouse-HiddenSecrets", trailer: "https://youtu.be/ETIBIT0xjeY", cover: "assets/other-games/guardianlighthousehiddensecrets200.webp" },
    { name: "Flower Match 3", slug: "FlowerMatch3", trailer: "https://youtu.be/g5CS9Vjvgu0", cover: "assets/other-games/flowermatch3200.webp" },
    { name: "Minesweeper", slug: "Minesweeper", trailer: "https://youtu.be/3l2BkAL1i-s", cover: "assets/other-games/minesweeper200.webp" },
    { name: "Number Chain", slug: "NumberChain", trailer: "https://youtu.be/GIME4_Pyy6E", cover: "assets/other-games/numberchain200.webp" },
    { name: "Halloween Pairs", slug: "HalloweenPairs", trailer: "https://youtu.be/bIaQoXX7WCA", cover: "assets/other-games/halloweenpairs200.webp" },
    { name: "Wild West Mysteries", slug: "WildWestMysteries", trailer: "https://youtu.be/nPyF7z5VJDU", cover: "assets/other-games/wildwestmysteries200.webp" },
    { name: "Daily Mini Sudoku", slug: "DailyMiniSudoku", trailer: "https://youtu.be/tptzh3JTaKI", cover: "assets/other-games/daily-mini-sudoku-200.webp" },
    { name: "Bubble Dropper", slug: "BubbleDropper", trailer: "https://youtu.be/MFzhNttw6Lc", cover: "assets/other-games/bubbledropper200.webp" },
    { name: "Donuts", slug: "Donuts", trailer: "https://youtu.be/HIVv1jKrGxs", cover: "assets/other-games/donuts200.webp" },
    { name: "Free Aliens", slug: "FreeAliens", trailer: "https://youtu.be/3AVsNPnOim4", cover: "assets/other-games/freealiens200.webp" },
    { name: "Drop", slug: "Drop", trailer: "https://youtu.be/HEH4RpzWfws", cover: "assets/other-games/drop200.webp" },
    { name: "Jewels Classic", slug: "JewelsClassic", trailer: "https://youtu.be/7WvAIKhQvug", cover: "assets/other-games/jewelsclassic200.webp" },
    { name: "Pentris", slug: "Pentris", trailer: "https://youtu.be/EuZblAZXgXE", cover: "assets/other-games/pentris200.webp" },
    { name: "Daily Photo Guess", slug: "DailyPhotoGuess", trailer: "https://youtu.be/aF4Nq42crRw", cover: "assets/other-games/daily-photo-guess-200.webp" },
    { name: "Medieval Castle Defense", slug: "MedievalCastleDefense", trailer: "https://youtu.be/AeHATqxExL0", cover: "assets/other-games/medievalcastledefense200.webp" },
    { name: "Medieval Castle Hidden Differences", slug: "MedievalCastleHiddenDifferences", trailer: "https://youtu.be/Oz9X_xXQSos", cover: "assets/other-games/medievalcastlehiddendifferences200.webp" },
    { name: "Mahjong Merge", slug: "MahjongMerge", trailer: "https://youtu.be/RPwA49RsRN4", cover: "assets/other-games/mahjongmerge200.webp" },
    { name: "Treasure Maze", slug: "TreasureMaze", trailer: null, cover: "assets/other-games/treasuremaze200.webp" },
    { name: "Matchstick Math Puzzle", slug: "MatchstickMathPuzzle", trailer: "https://youtu.be/lUToibYw2L0", cover: "assets/other-games/matchstickmathpuzzle200.webp" },
    { name: "Daily Binairo+", slug: "DailyBinairo+", trailer: "https://youtu.be/WKNnCmfxo_Y", cover: "assets/other-games/daily-binairo-plus-200.webp" },
    { name: "Nikakudori", slug: "Nikakudori", trailer: "https://youtu.be/1LRzuTIkv6g", cover: "assets/other-games/nikakudori200.webp" },
    { name: "Marble Shooter", slug: "MarbleShooter", trailer: "https://youtu.be/wkQzbi1Sh_c", cover: "assets/other-games/marbleshooter200.webp" },
    { name: "Rotate Puzzle Summer Beach", slug: "RotatePuzzleSummerBeach", trailer: "https://youtu.be/O9tVVDAgM_E", cover: "assets/other-games/rotatepuzzle-summerbeach200.webp" },
    { name: "Higher Or Lower", slug: "HigherOrLower", trailer: "https://youtu.be/DkXLxwCVoaY", cover: "assets/other-games/higherorlower200.webp" },
    { name: "Pyramid Solitaire Ancient Rome", slug: "PyramidSolitaire-AncientRome", trailer: "https://youtu.be/RzSG8a2rJ1A", cover: "assets/other-games/pyramidsolitaire-ancientrome200.webp" },
    { name: "Soccer Pinball", slug: "SoccerPinball", trailer: "https://youtu.be/LleWYcnO4GU", cover: "assets/other-games/soccerpinball200.webp" },
    { name: "Sudoku Classic", slug: "SudokuClassic", trailer: "https://youtu.be/YgJqAKYwW8E", cover: "assets/other-games/sudokuclassic200.webp" },
    { name: "Picture Pie Ancient City", slug: "PicturePieAncientCity", trailer: "https://youtu.be/oir4jR3MITY", cover: "assets/other-games/picturepieancientcity200.webp" },
    { name: "Nonogram Saga", slug: "NonogramSaga", trailer: "https://youtu.be/PZAUgXyJbCE", cover: "assets/other-games/nonogramsaga200.webp" },
    { name: "Slide Wood", slug: "SlideWood", trailer: "https://youtu.be/MDvBG3KlwaM", cover: "assets/other-games/slidewood200.webp" },
    { name: "Medieval Defense", slug: "MedievalDefense", trailer: "https://youtu.be/KwbvumaVgiQ", cover: "assets/other-games/medievaldefense200.webp" },
    { name: "Bubble Shooter", slug: "Bubble_Shooter", trailer: "https://youtu.be/dTJ5IBX-BkM", cover: "assets/other-games/bubble_shooter200.webp" },
    { name: "Gem Challenge", slug: "GemChallenge", trailer: "https://youtu.be/9b9m8U0Pn-c", cover: "assets/other-games/gemchallenge200.webp" },
    { name: "Mahjongg Pyramids", slug: "MahjonggPyramids", trailer: "https://youtu.be/ntkY4StwmMg", cover: "assets/other-games/mahjonggpyramids200.webp" },
    { name: "Bottle Shooter", slug: "BottleShooter", trailer: "https://youtu.be/Wpk6XZW-X18", cover: "assets/other-games/bottleshooter200.webp" },
    { name: "Jewels Of The Medici", slug: "JewelsOfTheMedici", trailer: "https://youtu.be/55fvVkyvjNw", cover: "assets/other-games/jewelsofthemedici200.webp" },
    { name: "Pantagruel Double Klondike", slug: "PantagruelDoubleKlondike", trailer: "https://youtu.be/pnCKcjTmpCc", cover: "assets/other-games/pantagrueldoubleklondike200.webp" },
    { name: "Downhill", slug: "Downhill", trailer: "https://youtu.be/yEXv1TG8LI8", cover: "assets/other-games/downhill200.webp" },
    { name: "Delicious Duos", slug: "DeliciousDuos", trailer: "https://youtu.be/g6f9Mu9Z2Cw", cover: "assets/other-games/deliciousduos200.webp" },
    { name: "Halloween Klondike", slug: "HalloweenKlondike", trailer: "https://youtu.be/U6Y8GLyXD4I", cover: "assets/other-games/halloweenklondike200.webp" },
    { name: "1010 Halloween", slug: "1010Halloween", trailer: "https://youtu.be/H8jEo1PpJxk", cover: "assets/other-games/1010halloween200.webp" },
    { name: "Magic Lamp Mahjong", slug: "MagicLampMahjong", trailer: "https://youtu.be/lNEuAlWlifM", cover: "assets/other-games/magiclampmahjong200.webp" },
    { name: "Pyramid Solitaire Great Pyramid", slug: "PyramidSolitaire-GreatPyramid", trailer: "https://youtu.be/VZsuatNE-ss", cover: "assets/other-games/pyramidsolitaire-greatpyramid200.webp" },
    { name: "Double Klondike", slug: "DoubleKlondike", trailer: "https://youtu.be/-YtfL2e-OmM", cover: "assets/other-games/doubleklondike200.webp" },
    { name: "Balloon Maze", slug: "BalloonMaze", trailer: "https://youtu.be/aEtg5blGksE", cover: "assets/other-games/balloonmaze200.webp" },
    { name: "Mysterious Pirate Jewels 3", slug: "MysteriousPirateJewels3", trailer: "https://youtu.be/VGifL0HpaWs", cover: "assets/other-games/mysteriouspiratejewels3200.webp" },
    { name: "Pyramid Solitaire Ancient China", slug: "PyramidSolitaire-AncientChina", trailer: "https://youtu.be/D3N6Dt1C6sw", cover: "assets/other-games/pyramidsolitaire-ancientchina200.webp" },
    { name: "Aladdin Solitaire", slug: "AladdinSolitaire", trailer: "https://youtu.be/aBDqOfY5oQ4", cover: "assets/other-games/aladdinsolitaire200.webp" },
    { name: "Tetris Puzzle", slug: "TetrisPuzzle", trailer: "https://youtu.be/MQlYxpArdKU", cover: "assets/other-games/tetrispuzzle200.webp" },
    { name: "Mahjong Move And Match", slug: "MahjongMoveAndMatch", trailer: "https://youtu.be/tMDBa8XBaGE", cover: "assets/other-games/mahjongmoveandmatch200.webp" },
    { name: "Puzzle Drop Space Adventure", slug: "PuzzleDropSpaceAdventure", trailer: "https://youtu.be/ymFoKHPHl9k", cover: "assets/other-games/puzzledropspaceadventure200.webp" },
    { name: "Happy Bees", slug: "HappyBees", trailer: "https://youtu.be/8ZfNswRK1PY", cover: "assets/other-games/happybees200.webp" },
    { name: "Ninja Breakout", slug: "NinjaBreakout", trailer: "https://youtu.be/r-xSAJ603Oo", cover: "assets/other-games/ninjabreakout200.webp" },
    { name: "Bubble Throw", slug: "BubbleThrow", trailer: "https://youtu.be/xO2Ga4HaUhU", cover: "assets/other-games/bubblethrow200.webp" },
    { name: "Circus Mahjong", slug: "CircusMahjong", trailer: "https://youtu.be/D5MG8cmher4", cover: "assets/other-games/circusmahjong200.webp" },
    { name: "Merge Cards", slug: "MergeCards", trailer: "https://youtu.be/lHdp8nOlJxo", cover: "assets/other-games/mergecards200.webp" },
    { name: "Daily Queens", slug: "DailyQueens", trailer: "https://youtu.be/vuqpixm0VDM", cover: "assets/other-games/daily-queens-200.webp" },
    { name: "Traffic Control", slug: "TrafficControl", trailer: null, cover: "assets/other-games/trafficcontrol200.webp" },
    { name: "Farm Mysteries", slug: "FarmMysteries", trailer: "https://youtu.be/T-AOKMKj5NA", cover: "assets/other-games/farmmysteries200.webp" },
    { name: "Zoo Collapse", slug: "ZooCollapse", trailer: "https://youtu.be/4KL2Re-UH50", cover: "assets/other-games/zoocollapse200.webp" },
    { name: "Easter Island Solitaire", slug: "EasterIslandSolitaire", trailer: "https://youtu.be/kFPHpPwDMIU", cover: "assets/other-games/easterislandsolitaire200.webp" },
    { name: "Connect The Dots", slug: "ConnectTheDots", trailer: "https://youtu.be/xOLcaoZqvJ0", cover: "assets/other-games/connectthedots200.webp" },
    { name: "Harbour Escape", slug: "HarbourEscape", trailer: "https://youtu.be/O8ipt5uVqp4", cover: "assets/other-games/harbourescape200.webp" },
    { name: "Picture Pie Harbour City", slug: "PicturePieHarbourCity", trailer: "https://youtu.be/LJBHmPFwa8o", cover: "assets/other-games/picturepieharbourcity200.webp" },
    { name: "Goblins Treasure Match", slug: "GoblinsTreasureMatch", trailer: "https://youtu.be/qlCbJ6MjT4c", cover: "assets/other-games/goblinstreasurematch200.webp" },
    { name: "Hawaiian Solitaire", slug: "HawaiianSolitaire", trailer: "https://youtu.be/Df3hiiQuAEs", cover: "assets/other-games/hawaiiansolitaire200.webp" },
    { name: "Twenty One", slug: "TwentyOne", trailer: "https://youtu.be/KsinazQcaYM", cover: "assets/other-games/twentyone200.webp" },
    { name: "Bubble Bubble", slug: "BubbleBubble", trailer: "https://youtu.be/853PjEeItC8", cover: "assets/other-games/bubblebubble200.webp" },
    { name: "Pyramid Tripeaks", slug: "PyramidTripeaks", trailer: "https://youtu.be/bXrDhn7ERmg", cover: "assets/other-games/pyramidtripeaks200.webp" },
    { name: "Mystery House", slug: "MysteryHouse", trailer: "https://youtu.be/VNmsBj3LDSQ", cover: "assets/other-games/mysteryhouse200.webp" },
    { name: "Extreme Billiards", slug: "ExtremeBilliards", trailer: "https://youtu.be/IMOLIg0pjJY", cover: "assets/other-games/extremebilliards200.webp" },
    { name: "Queen Of Egypt Cleopatras Jewels", slug: "QueenOfEgyptCleopatrasJewels", trailer: "https://youtu.be/Slj4SGDijbU", cover: "assets/other-games/queenofegyptcleopatrasjewels200.webp" },
    { name: "2048 Billiards", slug: "2048Billiards", trailer: "https://youtu.be/VZHdwMWAc_0", cover: "assets/other-games/2048billiards200.webp" },
    { name: "Pinball Breakout", slug: "PinballBreakout", trailer: "https://youtu.be/G9bThUYIgt4", cover: "assets/other-games/pinballbreakout200.webp" },
    { name: "Airport Sniper", slug: "AirportSniper", trailer: "https://youtu.be/ZQlmxL7hn54", cover: "assets/other-games/airportsniper200.webp" },
    { name: "Tesla Defense", slug: "TeslaDefense", trailer: "https://youtu.be/VKMmx97a3tA", cover: "assets/other-games/tesladefense200.webp" },
    { name: "Classic Gin Rummy", slug: "ClassicGinRummy", trailer: "https://youtu.be/iawAgTgdakM", cover: "assets/other-games/classicginrummy200.webp" },
    { name: "Crazy Eights", slug: "CrazyEights", trailer: "https://youtu.be/8_UGCfgLQaU", cover: "assets/other-games/crazyeights200.webp" },
    { name: "Mau Mau", slug: "MauMau", trailer: "https://youtu.be/cBPeu8nu2TM", cover: "assets/other-games/maumau200.webp" },
    { name: "Russian Solitaire", slug: "RussianSolitaire", trailer: "https://youtu.be/cHJqADQ-234", cover: "assets/other-games/russiansolitaire200.webp" },
    { name: "Ace Of Hearts", slug: "AceOfHearts", trailer: "https://youtu.be/0V8gncaVOz0", cover: "assets/other-games/aceofhearts200.webp" },
    { name: "Secret Russian", slug: "SecretRussian", trailer: "https://youtu.be/c3LY3rXLj-w", cover: "assets/other-games/secretrussian200.webp" },
    { name: "Hearts", slug: "Hearts", trailer: null, cover: "assets/other-games/hearts200.webp" },
    { name: "Classic Klondike", slug: "ClassicKlondike", trailer: "https://youtu.be/GlFWhgDRDGc", cover: "assets/other-games/classicklondike200.webp" },
    { name: "Thirty One", slug: "ThirtyOne", trailer: "https://youtu.be/fV4J7ozGJ6s", cover: "assets/other-games/thirtyone200.webp" },
    { name: "Double Freecell", slug: "DoubleFreecell", trailer: null, cover: "assets/other-games/doublefreecell200.webp" },
    { name: "5 Stack Blackjack", slug: "5StackBlackjack", trailer: "https://youtu.be/uwkuCR4VmPA", cover: "assets/other-games/5stackblackjack200.webp" },
    { name: "Thieves Of Egypt", slug: "ThievesOfEgypt", trailer: "https://youtu.be/SsYA_kJPCis", cover: "assets/other-games/thievesofegypt200.webp" },
    { name: "Kings Klondike", slug: "KingsKlondike", trailer: null, cover: "assets/other-games/kingklondike200.webp" },
    { name: "Tower Solitaire", slug: "TowerSolitaire", trailer: "https://youtu.be/TQT4Xd4BN_Q", cover: "assets/other-games/towersolitaire200.webp" },
    { name: "Clock Solitaire", slug: "ClockSolitaire", trailer: "https://youtu.be/ZSp9CuxdrdA", cover: "assets/other-games/clocksolitaire200.webp" },
    { name: "Castles In Spain", slug: "CastlesInSpain", trailer: "https://youtu.be/O1ywLv-5nLw", cover: "assets/other-games/castlesinspain200.webp" },
    { name: "Kraken", slug: "Kraken", trailer: "https://youtu.be/5NcTgvc4xUQ", cover: "assets/other-games/kraken-200.webp" },
    { name: "Bingo", slug: "Bingo", trailer: "https://youtu.be/1P5fU6B01NM", cover: "assets/other-games/bingo200.webp" },
    { name: "Giza Solitaire", slug: "GizaSolitaire", trailer: null, cover: "assets/other-games/gizasolitaire200.webp" },
    { name: "Pyramid Of Love", slug: "PyramidOfLove", trailer: "https://youtu.be/3RTkLYvvFJA", cover: "assets/other-games/pyramidoflove200.webp" },
    { name: "Bubble Billiards", slug: "BubbleBilliards", trailer: "https://youtu.be/RxeiQsL8dZc", cover: "assets/other-games/bubblebilliards200.webp" },
    { name: "Neon Billiards", slug: "NeonBilliards", trailer: "https://youtu.be/ie1Gin_p5FU", cover: "assets/other-games/neonbilliards200.webp" },
    { name: "Love Bubbles", slug: "LoveBubbles", trailer: "https://youtu.be/v__ZhwLkVIw", cover: "assets/other-games/lovebubbles200.webp" },
    { name: "Lost Island 3", slug: "LostIsland3", trailer: "https://youtu.be/M2Vmg8q0LAo", cover: "assets/other-games/lostisland3200.webp" },
    { name: "The Brain Train", slug: "TheBrainTrain", trailer: "https://youtu.be/bH2S2I-eGuI", cover: "assets/other-games/thebraintrain200.webp" },
  ];

  function initCasino3D() {
    const applyTilt = (target, x, y) => {
      const rect = target.getBoundingClientRect();
      const px = (x - rect.left) / rect.width;
      const py = (y - rect.top) / rect.height;
      const rx = (0.5 - py) * 10;
      const ry = (px - 0.5) * 12;
      target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
    };

    document.querySelectorAll('.game-card').forEach((card) => {
      card.addEventListener('mousemove', (event) => applyTilt(card, event.clientX, event.clientY));
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.panel').forEach((panel) => {
      panel.addEventListener('mousemove', (event) => {
        const rect = panel.getBoundingClientRect();
        const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
        panel.style.transform = `rotateX(${-dy}deg) rotateY(${dx}deg)`;
      });
      panel.addEventListener('mouseleave', () => { panel.style.transform = ''; });
    });
  }

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html) { el.globalNotice.innerHTML = html; el.globalNotice.classList.add("show"); }
  function fmt(n) { return n.toLocaleString(); }

  // ============================================================
  // Auth wiring
  // ============================================================
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t === tab));
      const target = tab.getAttribute("data-tab");
      el.loginPanel.classList.toggle("active", target === "login");
      el.registerPanel.classList.toggle("active", target === "register");
    });
  });
  document.querySelectorAll("[data-switch]").forEach(btn => {
    btn.addEventListener("click", () => document.querySelector(`.auth-tab[data-tab="${btn.getAttribute("data-switch")}"]`).click());
  });

  function showAuthError(msg) { el.authError.textContent = msg; el.authError.classList.add("show"); }
  function clearAuthError() { el.authError.classList.remove("show"); }

  el.loginPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await A.login({ email: document.getElementById("loginEmail").value, password: document.getElementById("loginPassword").value });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.registerPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await A.register({
        nickname: document.getElementById("registerNickname").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
      });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.signOutBtn.addEventListener("click", () => { finalizeOtherGameSession(); A.logout(); location.reload(); });

  // ============================================================
  // View switching
  // ============================================================
  function showView(name) {
    if (name !== "lobbyView") finalizeOtherGameSession();
    ["lobbyView", "slotsView", "blackjackView", "rouletteView", "baccaratView", "kenoView", "leaderboardView", "demoGameView"].forEach(v => {
      el[v].style.display = v === name ? "block" : "none";
    });
    if (name === "lobbyView") renderLobby();
    if (name === "leaderboardView") renderLeaderboard("monthly");
  }
  el.navLobbyBtn.addEventListener("click", () => showView("lobbyView"));
  el.navLeaderboardBtn.addEventListener("click", () => showView("leaderboardView"));
  el.navDashboardBtn.addEventListener("click", () => {
    try { window.top.location.href = "/dashboard"; }
    catch (err) { window.location.href = "/dashboard"; }
  });
  document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => showView("lobbyView")));
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const game = card.getAttribute("data-game");
      if (game === "slots") { showView("slotsView"); renderSlotsPaytable(); }
      else if (game === "blackjack") { showView("blackjackView"); resetBlackjackUI(); }
      else if (game === "roulette") { showView("rouletteView"); renderRouletteBoard(); }
      else if (game === "baccarat") { showView("baccaratView"); resetBaccaratUI(); }
      else if (game === "keno") { showView("kenoView"); renderKenoBoard(); }
    });
  });

  function refreshBalanceDisplay() {
    const user = A.getCurrentUser();
    state.currentUser = user;
    el.balanceDisplay.textContent = fmt(user.balance);
  }

  function renderLobby() {
    refreshBalanceDisplay();
    const user = state.currentUser;
    el.lobbyBalance.textContent = fmt(user.balance);
    el.lobbyNetChange.textContent = fmt(user.balance) + " coins";
    el.lobbyNetChange.style.color = "var(--green)";
    el.monthLabel.textContent = "Month: " + A.currentMonthKey();
    renderCatalog();
    renderOtherGames();
  }

  function otherGamesStatsKey() {
    const email = String(state.currentUser?.email || "guest").toLowerCase();
    return `aigmg:othergames:stats:${email}`;
  }

  function loadOtherGamesStats() {
    try {
      const raw = localStorage.getItem(otherGamesStatsKey());
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveOtherGamesStats() {
    try {
      localStorage.setItem(otherGamesStatsKey(), JSON.stringify(state.otherGameStats || {}));
    } catch (err) {
      // Ignore storage errors so gameplay remains functional.
    }
  }

  function ensureOtherGameStat(game) {
    if (!game?.slug) return null;
    if (!state.otherGameStats[game.slug]) {
      state.otherGameStats[game.slug] = {
        slug: game.slug,
        name: game.name,
        starts: 0,
        totalMs: 0,
        lastPlayedAt: 0
      };
    }
    state.otherGameStats[game.slug].name = game.name;
    return state.otherGameStats[game.slug];
  }

  function formatPlaytime(ms) {
    const totalMinutes = Math.floor((Number(ms) || 0) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours <= 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }

  function renderOtherGamesTopLists() {
    if (!el.otherGamesTopTime || !el.otherGamesTopStarts) return;
    const rows = Object.values(state.otherGameStats || {}).filter((r) => (r.starts || 0) > 0 || (r.totalMs || 0) > 0);

    if (!rows.length) {
      const emptyHtml = "<li>No sessions yet</li>";
      el.otherGamesTopTime.innerHTML = emptyHtml;
      el.otherGamesTopStarts.innerHTML = emptyHtml;
      return;
    }

    const topByTime = [...rows]
      .sort((a, b) => (b.totalMs - a.totalMs) || (b.starts - a.starts) || String(a.name).localeCompare(String(b.name)))
      .slice(0, 15);

    const topByStarts = [...rows]
      .sort((a, b) => (b.starts - a.starts) || (b.totalMs - a.totalMs) || String(a.name).localeCompare(String(b.name)))
      .slice(0, 15);

    el.otherGamesTopTime.innerHTML = topByTime
      .map((r) => `<li>${escapeHtml(r.name)} — ${formatPlaytime(r.totalMs)}</li>`)
      .join("");

    el.otherGamesTopStarts.innerHTML = topByStarts
      .map((r) => `<li>${escapeHtml(r.name)} — ${r.starts} starts</li>`)
      .join("");
  }

  function finalizeOtherGameSession() {
    if (!state.otherGameActiveSlug || !state.otherGameSessionStartMs) return;
    const stat = state.otherGameStats[state.otherGameActiveSlug];
    if (stat) {
      const elapsed = Math.max(0, Date.now() - state.otherGameSessionStartMs);
      stat.totalMs = (stat.totalMs || 0) + elapsed;
      stat.lastPlayedAt = Date.now();
      saveOtherGamesStats();
      renderOtherGamesTopLists();
    }
    state.otherGameActiveSlug = null;
    state.otherGameSessionStartMs = null;
  }

  function beginOtherGameSession(game) {
    finalizeOtherGameSession();
    const stat = ensureOtherGameStat(game);
    if (!stat) return;
    stat.starts = (stat.starts || 0) + 1;
    stat.lastPlayedAt = Date.now();
    state.otherGameActiveSlug = game.slug;
    state.otherGameSessionStartMs = Date.now();
    saveOtherGamesStats();
    renderOtherGamesTopLists();
  }

  function loadOtherGame(game) {
    beginOtherGameSession(game);
    const direct = `https://cdn.htmlgames.com/${game.slug}/`;
    if (el.otherGamePlaceholder) el.otherGamePlaceholder.style.display = "none";
    el.otherGameFrame.style.display = "block";
    el.otherGameFrame.src = direct;
    el.otherGameNowPlaying.textContent = `Now playing: ${game.name}`;
    const hasTrailer = typeof game.trailer === "string"
      && game.trailer.startsWith("https://youtu.be/")
      && !game.trailer.includes("youtu.be/null");
    if (hasTrailer) {
      el.otherGameTrailerLink.href = game.trailer;
      el.otherGameTrailerLink.style.display = "inline-flex";
    } else {
      el.otherGameTrailerLink.removeAttribute("href");
      el.otherGameTrailerLink.style.display = "none";
    }

    // Move the page to the embedded player immediately after selecting a game.
    el.otherGameFrame.scrollIntoView({ behavior: "auto", block: "start" });
  }

  function renderOtherGames() {
    if (!el.otherGamesGrid || !el.otherGameFrame) return;
    el.otherGamesGrid.innerHTML = otherGames.map((game, idx) => `
      <div class="other-game-card" data-other-game="${idx}">
        ${game.cover ? `<img class="other-game-cover" src="${escapeHtml(game.cover)}" alt="${escapeHtml(game.name)} cover" loading="lazy">` : ""}
        <div class="other-game-title">${escapeHtml(game.name)}</div>
        <div class="other-game-actions">
          <button class="other-game-btn primary" data-other-game="${idx}">Play Here</button>
          <button class="other-game-btn" data-other-game="${idx}">Open In Iframe</button>
        </div>
      </div>`).join('');
      renderOtherGamesTopLists();
  }

  el.otherGamesGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-other-game]');
    if (!button) return;
    const idx = parseInt(button.getAttribute('data-other-game'), 10);
    const game = otherGames[idx];
    if (!game) return;
    loadOtherGame(game);
  });

  el.otherGameBackToList?.addEventListener("click", () => {
    // Stop the current embedded game and bring focus back to the game picker grid.
    finalizeOtherGameSession();
    el.otherGameFrame.src = "about:blank";
    el.otherGameFrame.style.display = "none";
    if (el.otherGamePlaceholder) el.otherGamePlaceholder.style.display = "block";
    el.otherGameNowPlaying.textContent = "No game selected";
    el.otherGamesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function quickRoundMultiplier(edge) {
    const roll = G.randomInt(1000) / 1000;
    if (edge === "low") {
      if (roll < 0.005) return 6;
      if (roll < 0.24) return 2;
      if (roll < 0.62) return 1.1;
      return 0;
    }
    if (edge === "high") {
      if (roll < 0.03) return 15;
      if (roll < 0.11) return 3;
      if (roll < 0.25) return 1.4;
      return 0;
    }
    if (roll < 0.015) return 8;
    if (roll < 0.14) return 2;
    if (roll < 0.48) return 1.6;
    return 0;
  }

  function renderCatalog(filterCat) {
    const active = filterCat || (document.querySelector(".catalog-chip.active")?.getAttribute("data-cat") || "all");
    const list = active === "all" ? demoCatalog : demoCatalog.filter((g) => g.cat === active);
    el.catalogGrid.innerHTML = list.map((g, i) => `
      <div class="catalog-card">
        <div class="catalog-head"><span class="catalog-icon">${g.icon}</span><span class="catalog-badge">${g.cat.toUpperCase()}</span></div>
        <div class="catalog-title">${escapeHtml(g.name)}</div>
        <div class="catalog-sub">${escapeHtml(g.note)}</div>
        <button class="catalog-play" data-demo-index="${i}">Play Demo</button>
      </div>`).join("");
  }

  function openActualGameFromDemo(game) {
    const name = String(game.name || "").toLowerCase();
    const bet = parseInt(el.catalogBetAmount.value || "50", 10);

    // Route demo tiles into real playable views.
    if (game.cat === "slots" || name.includes("reel") || name.includes("fruit")) {
      el.slotsBetAmount.value = String(Math.max(10, bet));
      showView("slotsView");
      renderSlotsPaytable();
      return;
    }

    if (name.includes("blackjack") || name.includes("poker") || name.includes("hi-lo")) {
      el.bjBetAmount.value = String(Math.max(10, bet));
      showView("blackjackView");
      resetBlackjackUI();
      return;
    }

    if (name.includes("roulette") || name.includes("wheel") || name.includes("plinko") || name.includes("crash")) {
      el.rouletteBetAmount.value = String(Math.max(10, bet));
      showView("rouletteView");
      renderRouletteBoard();
      return;
    }

    if (name.includes("baccarat") || name.includes("sic bo")) {
      el.baccaratBetAmount.value = String(Math.max(10, bet));
      showView("baccaratView");
      resetBaccaratUI();
      return;
    }

    el.kenoBetAmount.value = String(Math.max(10, bet));
    showView("kenoView");
    renderKenoBoard();
  }

  document.querySelectorAll(".catalog-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".catalog-chip").forEach((c) => c.classList.toggle("active", c === chip));
      renderCatalog(chip.getAttribute("data-cat"));
    });
  });

  el.catalogGrid.addEventListener("click", (event) => {
    const btn = event.target.closest(".catalog-play");
    if (!btn) return;

    const filtered = document.querySelector(".catalog-chip.active")?.getAttribute("data-cat") || "all";
    const list = filtered === "all" ? demoCatalog : demoCatalog.filter((g) => g.cat === filtered);
    const game = list[parseInt(btn.getAttribute("data-demo-index"), 10)];
    if (!game) return;

    state.selectedDemoGame = game;
    el.catalogStatus.style.color = "var(--text-dim)";
    el.catalogStatus.textContent = `${game.name}: opened in real game mode.`;
    openActualGameFromDemo(game);
  });

  el.demoGamePlayBtn.addEventListener("click", () => {
    const game = state.selectedDemoGame;
    if (!game) {
      showNotice("<b>Select a demo game from the library first.</b>");
      return;
    }

    const bet = parseInt(el.demoGameBetAmount.value, 10);
    if (!validateBet(bet)) return;

    const payoutMultiplier = quickRoundMultiplier(game.edge);
    const payout = Math.round(bet * payoutMultiplier);
    const netChange = payout - bet;
    applyBalanceChange(netChange);

    if (netChange >= 0) {
      el.demoGameResult.className = "slots-result win";
      el.demoGameResult.textContent = `You won +${fmt(netChange)} 🪙 (payout ${payoutMultiplier.toFixed(2)}x)`;
      el.catalogStatus.style.color = "var(--green)";
      el.catalogStatus.textContent = `${game.name}: +${fmt(netChange)} 🪙 (payout ${payoutMultiplier.toFixed(2)}x)`;
    } else {
      el.demoGameResult.className = "slots-result lose";
      el.demoGameResult.textContent = `You lost ${fmt(Math.abs(netChange))} 🪙`;
      el.catalogStatus.style.color = "var(--red-bright)";
      el.catalogStatus.textContent = `${game.name}: -${fmt(Math.abs(netChange))} 🪙`;
    }
  });

  // ============================================================
  // Bet helpers — every game shares the same guard: never bet more
  // than the current balance, never allow a non-positive bet.
  // ============================================================
  function validateBet(amount) {
    if (!Number.isFinite(amount) || amount <= 0) { showNotice("<b>Enter a valid bet amount.</b>"); return false; }
    if (amount > state.currentUser.balance) { showNotice("<b>You can't bet more than your current balance.</b>"); return false; }
    return true;
  }
  function applyBalanceChange(delta) {
    const user = A.getCurrentUser();
    const newBalance = user.balance + delta;
    A.updateBalance(user.email, newBalance);
    refreshBalanceDisplay();
  }

  // ============================================================
  // SLOTS
  // ============================================================
  function renderSlotsPaytable() {
    const rtp = G.computeSlotsRTP();
    el.slotsPaytable.innerHTML = `
      <div class="paytable-row"><span>Three matching \ud83c\udf52</span><span>${G.SLOTS_PAYTABLE.cherry}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83c\udf4b</span><span>${G.SLOTS_PAYTABLE.lemon}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83d\udd14</span><span>${G.SLOTS_PAYTABLE.bell}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \u2b50</span><span>${G.SLOTS_PAYTABLE.star}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching 7\ufe0f\u20e3</span><span>${G.SLOTS_PAYTABLE.seven}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83d\udc8e</span><span>${G.SLOTS_PAYTABLE.diamond}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Any two \ud83c\udf52 (cherry pair)</span><span>${G.CHERRY_PAIR_PAYOUT}\u00d7 bet</span></div>
      <div class="paytable-row" style="color:var(--text-faint);"><span>Theoretical return-to-player</span><span>${(rtp * 100).toFixed(1)}%</span></div>`;
  }
  el.slotsRtpLink.addEventListener("click", e => {
    e.preventDefault();
    alert("RTP (return-to-player) is the % of all money wagered that's paid back out on average, computed exactly from the disclosed paytable above — not a marketing number. " + (G.computeSlotsRTP() * 100).toFixed(2) + "% here means the house edge is " + (100 - G.computeSlotsRTP() * 100).toFixed(2) + "%, same ballpark as a real slot machine, and it never changes based on how long you've played or how much you've won or lost.");
  });

  el.slotsBetDown.addEventListener("click", () => { el.slotsBetAmount.value = Math.max(10, parseInt(el.slotsBetAmount.value || 10, 10) - 10); });
  el.slotsBetUp.addEventListener("click", () => { el.slotsBetAmount.value = parseInt(el.slotsBetAmount.value || 10, 10) + 10; });

  let slotsSpinning = false;
  el.slotsSpinBtn.addEventListener("click", async () => {
    if (slotsSpinning) return;
    const bet = parseInt(el.slotsBetAmount.value, 10);
    if (!validateBet(bet)) return;

    slotsSpinning = true;
    el.slotsSpinBtn.disabled = true;
    [el.reel0, el.reel1, el.reel2].forEach(r => r.classList.add("spinning"));
    el.slotsResult.textContent = "";

    const result = G.spinSlots(bet);
    await new Promise(r => setTimeout(r, 700)); // brief spin animation, not a manipulated delay tied to outcome

    [el.reel0, el.reel1, el.reel2].forEach(r => r.classList.remove("spinning"));
    el.reel0.textContent = result.reels[0].label;
    el.reel1.textContent = result.reels[1].label;
    el.reel2.textContent = result.reels[2].label;

    applyBalanceChange(result.netChange);

    if (result.isWin) {
      el.slotsResult.className = "slots-result win";
      el.slotsResult.textContent = (result.winType === "triple" ? "Triple match! " : "Cherry pair! ") + "+" + fmt(result.payout) + " \ud83e\ude99";
    } else {
      el.slotsResult.className = "slots-result lose";
      el.slotsResult.textContent = "No match this time.";
    }

    slotsSpinning = false;
    el.slotsSpinBtn.disabled = false;
  });

  // ============================================================
  // BLACKJACK
  // ============================================================
  function resetBlackjackUI() {
    state.bjState = null;
    el.dealerCards.innerHTML = ""; el.playerCards.innerHTML = "";
    el.dealerTotal.textContent = ""; el.playerTotal.textContent = "";
    el.bjResult.textContent = "";
    el.bjBetRow.style.display = "flex";
    el.bjActionsRow.style.display = "none";
  }

  function cardHtml(card, hidden) {
    if (hidden) return `<div class="bj-card hidden">??</div>`;
    const isRed = card.suit === "\u2665" || card.suit === "\u2666";
    return `<div class="bj-card ${isRed ? "red" : ""}">${card.rank}${card.suit}</div>`;
  }
  function renderBjHands(revealDealer) {
    const bj = state.bjState;
    el.dealerCards.innerHTML = bj.dealer.map((c, i) => cardHtml(c, i === 1 && !revealDealer)).join("");
    el.playerCards.innerHTML = bj.player.map(c => cardHtml(c)).join("");
    const pv = G.handValue(bj.player);
    el.playerTotal.textContent = pv.total + (pv.isSoft ? " (soft)" : "") + (pv.isBust ? " \u2014 bust" : "");
    if (revealDealer) {
      const dv = G.handValue(bj.dealer);
      el.dealerTotal.textContent = dv.total + (dv.isBust ? " \u2014 bust" : "");
    } else {
      el.dealerTotal.textContent = "?";
    }
  }

  el.bjDealBtn.addEventListener("click", () => {
    const bet = parseInt(el.bjBetAmount.value, 10);
    if (!validateBet(bet)) return;
    const shoe = G.freshShoe(1);
    state.bjState = { shoe, player: [shoe.pop(), shoe.pop()], dealer: [shoe.pop(), shoe.pop()], bet, doubled: false, resolved: false };
    el.bjResult.textContent = "";
    renderBjHands(false);

    const pv = G.handValue(state.bjState.player);
    if (pv.isBlackjack) { resolveBlackjack(); return; }

    el.bjBetRow.style.display = "none";
    el.bjActionsRow.style.display = "flex";
  });

  el.bjHitBtn.addEventListener("click", () => {
    const bj = state.bjState;
    bj.player.push(bj.shoe.pop());
    renderBjHands(false);
    const pv = G.handValue(bj.player);
    if (pv.isBust) resolveBlackjack();
  });

  el.bjDoubleBtn.addEventListener("click", () => {
    const bj = state.bjState;
    if (bj.bet > state.currentUser.balance) { showNotice("<b>Not enough balance to double.</b>"); return; }
    bj.doubled = true;
    bj.player.push(bj.shoe.pop());
    renderBjHands(false);
    const pv = G.handValue(bj.player);
    if (pv.isBust) resolveBlackjack();
    else resolveBlackjack(); // double = one card then must stand
  });

  el.bjStandBtn.addEventListener("click", () => resolveBlackjack());

  function resolveBlackjack() {
    const bj = state.bjState;
    if (bj.resolved) return;
    bj.resolved = true;

    let playerValue = G.handValue(bj.player);
    if (!playerValue.isBust) {
      while (G.dealerShouldHit(bj.dealer)) bj.dealer.push(bj.shoe.pop());
    }
    renderBjHands(true);

    const dealerValue = G.handValue(bj.dealer);
    const effectiveBet = bj.doubled ? bj.bet * 2 : bj.bet;
    let netChange, message, cls;

    if (playerValue.isBust) { netChange = -effectiveBet; message = "Bust \u2014 you lose."; cls = "lose"; }
    else if (playerValue.isBlackjack && !dealerValue.isBlackjack) { netChange = Math.round(bj.bet * 1.5); message = "Blackjack! +" + fmt(netChange) + " \ud83e\ude99 (pays 3:2)"; cls = "win"; }
    else if (dealerValue.isBust) { netChange = effectiveBet; message = "Dealer busts \u2014 you win! +" + fmt(netChange) + " \ud83e\ude99"; cls = "win"; }
    else if (playerValue.total > dealerValue.total) { netChange = effectiveBet; message = "You win! +" + fmt(netChange) + " \ud83e\ude99"; cls = "win"; }
    else if (playerValue.total < dealerValue.total) { netChange = -effectiveBet; message = "Dealer wins."; cls = "lose"; }
    else { netChange = 0; message = "Push \u2014 bet returned."; cls = "lose"; }

    applyBalanceChange(netChange);
    el.bjResult.className = "slots-result " + cls;
    el.bjResult.textContent = message;
    el.bjActionsRow.style.display = "none";
    el.bjBetRow.style.display = "flex";
  }

  // ============================================================
  // ROULETTE
  // ============================================================
  function renderRouletteBoard() {
    state.rouletteSelection = null;
    el.rouletteResultArea.innerHTML = "";
    el.rouletteSelectionLabel.textContent = "Pick a bet above";

    let numsHtml = `<div class="roulette-num green" data-bet-type="straight" data-bet-value="0">0</div>`;
    for (let n = 1; n <= 36; n++) {
      numsHtml += `<div class="roulette-num ${G.rouletteColor(n)}" data-bet-type="straight" data-bet-value="${n}">${n}</div>`;
    }
    el.rouletteGrid.innerHTML = numsHtml;

    el.rouletteOutsideBets.innerHTML = `
      <button data-bet-type="red" data-bet-value="">Red (1:1)</button>
      <button data-bet-type="black" data-bet-value="">Black (1:1)</button>
      <button data-bet-type="odd" data-bet-value="">Odd (1:1)</button>
      <button data-bet-type="even" data-bet-value="">Even (1:1)</button>
      <button data-bet-type="low" data-bet-value="">1-18 (1:1)</button>
      <button data-bet-type="high" data-bet-value="">19-36 (1:1)</button>
      <button data-bet-type="dozen" data-bet-value="1">1st 12 (2:1)</button>
      <button data-bet-type="dozen" data-bet-value="2">2nd 12 (2:1)</button>
      <button data-bet-type="dozen" data-bet-value="3">3rd 12 (2:1)</button>`;

    document.querySelectorAll("#rouletteGrid .roulette-num, #rouletteOutsideBets button").forEach(el2 => {
      el2.addEventListener("click", () => {
        document.querySelectorAll("#rouletteGrid .roulette-num, #rouletteOutsideBets button").forEach(x => x.classList.remove("selected"));
        el2.classList.add("selected");
        const betType = el2.getAttribute("data-bet-type");
        const betValueRaw = el2.getAttribute("data-bet-value");
        const betValue = betValueRaw ? parseInt(betValueRaw, 10) : null;
        state.rouletteSelection = { betType, betValue };
        const multiplier = G.ROULETTE_PAYOUTS[betType];
        el.rouletteSelectionLabel.textContent = "Betting on: " + betType + (betValueRaw ? " " + betValueRaw : "") + " (pays " + multiplier + ":1)";
      });
    });
  }

  el.rouletteSpinBtn.addEventListener("click", async () => {
    if (!state.rouletteSelection) { showNotice("<b>Pick a bet first.</b>"); return; }
    const bet = parseInt(el.rouletteBetAmount.value, 10);
    if (!validateBet(bet)) return;

    el.rouletteSpinBtn.disabled = true;
    el.rouletteResultArea.innerHTML = `<div style="color:var(--text-faint);">Spinning\u2026</div>`;
    const winningNumber = G.spinRoulette();
    await new Promise(r => setTimeout(r, 600));

    const { betType, betValue } = state.rouletteSelection;
    const evalResult = G.evaluateRouletteBet(betType, betValue, winningNumber);
    const netChange = evalResult.won ? bet * evalResult.payoutMultiplier : -bet;
    applyBalanceChange(netChange);

    const color = G.rouletteColor(winningNumber);
    const bg = color === "red" ? "#b5473a" : color === "black" ? "#2a2d33" : "#2e7d5b";
    el.rouletteResultArea.innerHTML = `
      <div class="roulette-ball-display" style="background:${bg};">${winningNumber}</div>
      <div style="margin-top:10px; font-weight:700; color:${evalResult.won ? "var(--green)" : "var(--red-bright)"};">
        ${evalResult.won ? "You won! +" + fmt(netChange) + " \ud83e\ude99" : "No win this spin \u2014 " + fmt(bet) + " \ud83e\ude99 lost"}
      </div>`;
    el.rouletteSpinBtn.disabled = false;
  });

  // ============================================================
  // BACCARAT
  // ============================================================
  function simpleCard(card) {
    const isRed = card.suit === "♥" || card.suit === "♦";
    return `<div class="bj-card ${isRed ? "red" : ""}" style="width:42px; height:58px; font-size:15px;">${card.rank}${card.suit}</div>`;
  }

  function resetBaccaratUI() {
    el.baccaratPlayerCards.innerHTML = "";
    el.baccaratBankerCards.innerHTML = "";
    el.baccaratTotals.textContent = "";
    el.baccaratResult.textContent = "";
  }

  el.baccaratDealBtn.addEventListener("click", () => {
    const bet = parseInt(el.baccaratBetAmount.value, 10);
    if (!validateBet(bet)) return;

    const betOn = el.baccaratBetChoice.value;
    const result = G.playBaccaratRound(bet, betOn);

    el.baccaratPlayerCards.innerHTML = result.player.map(simpleCard).join("");
    el.baccaratBankerCards.innerHTML = result.banker.map(simpleCard).join("");
    el.baccaratTotals.textContent = `Player ${result.playerTotal} · Banker ${result.bankerTotal} · Outcome: ${result.outcome.toUpperCase()}`;

    applyBalanceChange(result.netChange);
    el.baccaratResult.className = "slots-result " + (result.won ? "win" : "lose");
    if (result.won) {
      el.baccaratResult.textContent = `You won! +${fmt(result.payout)} 🪙`;
    } else {
      el.baccaratResult.textContent = `You lost ${fmt(bet)} 🪙`;
    }
  });

  // ============================================================
  // KENO
  // ============================================================
  function renderKenoBoard() {
    if (el.kenoGrid.children.length !== 40) {
      let html = "";
      for (let n = 1; n <= 40; n++) {
        html += `<button class="keno-ball" data-keno="${n}">${n}</button>`;
      }
      el.kenoGrid.innerHTML = html;
      el.kenoGrid.querySelectorAll(".keno-ball").forEach((btn) => {
        btn.addEventListener("click", () => {
          const n = parseInt(btn.getAttribute("data-keno"), 10);
          if (state.kenoPicks.has(n)) {
            state.kenoPicks.delete(n);
            btn.classList.remove("selected");
          } else {
            if (state.kenoPicks.size >= 10) return;
            state.kenoPicks.add(n);
            btn.classList.add("selected");
          }
          el.kenoPicksLabel.textContent = `Picked ${state.kenoPicks.size}/10 numbers`;
        });
      });
    }

    el.kenoGrid.querySelectorAll(".keno-ball").forEach((btn) => {
      btn.classList.remove("hit");
      const n = parseInt(btn.getAttribute("data-keno"), 10);
      btn.classList.toggle("selected", state.kenoPicks.has(n));
    });
    el.kenoPicksLabel.textContent = `Picked ${state.kenoPicks.size}/10 numbers`;
  }

  el.kenoDrawBtn.addEventListener("click", () => {
    const bet = parseInt(el.kenoBetAmount.value, 10);
    if (!validateBet(bet)) return;
    if (state.kenoPicks.size !== 10) { showNotice("<b>Pick exactly 10 numbers for Keno.</b>"); return; }

    const picks = Array.from(state.kenoPicks).sort((a, b) => a - b);
    const result = G.playKenoRound(bet, picks);
    applyBalanceChange(result.netChange);

    el.kenoGrid.querySelectorAll(".keno-ball").forEach((btn) => {
      btn.classList.remove("hit");
      const n = parseInt(btn.getAttribute("data-keno"), 10);
      if (result.matches.includes(n)) btn.classList.add("hit");
    });

    el.kenoResult.className = "slots-result " + (result.won ? "win" : "lose");
    if (result.won) {
      el.kenoResult.textContent = `Matches: ${result.matchCount} · You won +${fmt(result.payout)} 🪙`;
    } else {
      el.kenoResult.textContent = `Matches: ${result.matchCount} · You lost ${fmt(bet)} 🪙`;
    }
    el.kenoPicksLabel.textContent = `Draw: ${result.draw.join(", ")}`;
  });

  // ============================================================
  // LEADERBOARDS
  // ============================================================
  document.querySelectorAll(".lb-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".lb-tab").forEach(t => t.classList.toggle("active", t === tab));
      renderLeaderboard(tab.getAttribute("data-lb"));
    });
  });

  function renderLeaderboard(type) {
    const rows = type === "monthly" ? A.monthlyLeaderboard() : A.yearlyLeaderboard();
    const myNickname = state.currentUser.nickname;
    if (!rows.length) {
      el.leaderboardPanel.innerHTML = `<div style="text-align:center; color:var(--text-faint); padding:30px 0;">No players yet this ${type === "monthly" ? "month" : "year"}.</div>`;
      return;
    }
    el.leaderboardPanel.innerHTML = rows.map((r, i) => {
      const score = type === "monthly" ? r.coins : r.bestMonthCoins;
      const isMe = r.nickname === myNickname;
      return `
        <div class="lb-row ${isMe ? "lb-you" : ""}">
          <span class="lb-rank ${i < 3 ? "top3" : ""}">#${i + 1}</span>
          <span class="lb-nickname">${escapeHtml(r.nickname)}${isMe ? " (you)" : ""}</span>
          <span class="lb-score ${score >= 0 ? "positive" : "negative"}">${fmt(score)} \ud83e\ude99</span>
        </div>`;
    }).join("");
  }

  // ============================================================
  // Boot
  // ============================================================
  function boot() {
    const user = A.getCurrentUser();
    if (!user) { el.authShell.style.display = "flex"; el.appShell.style.display = "none"; return; }
    state.currentUser = user;
    state.otherGameStats = loadOtherGamesStats();
    state.otherGameActiveSlug = null;
    state.otherGameSessionStartMs = null;
    el.authShell.style.display = "none";
    el.appShell.style.display = "block";
    refreshBalanceDisplay();
    showView("lobbyView");
    initCasino3D();
  }

  window.addEventListener("beforeunload", finalizeOtherGameSession);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) finalizeOtherGameSession();
  });

  boot();
})();
