// require('react-native-gesture-handler/jestSetup');
// require('react-native-reanimated').setUpTests();

jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: {
    getApiLevel: jest.fn().mockResolvedValue(35),
    getBrand: jest.fn(() => 'mock-brand'),
    getBuildId: jest.fn().mockResolvedValue('mock-build-id'),
    getBuildNumber: jest.fn(() => '1'),
    getBundleId: jest.fn(() => 'com.lnreader'),
    getDeviceId: jest.fn(() => 'mock-device'),
    getManufacturer: jest.fn().mockResolvedValue('mock-manufacturer'),
    getModel: jest.fn(() => 'mock-model'),
    getSystemName: jest.fn(() => 'Android'),
    getSystemVersion: jest.fn(() => '15'),
    getVersion: () => '1.0.0',
    getApplicationName: () => 'LNReader',
    supportedAbis: jest.fn().mockResolvedValue([]),
  },
  getBatteryLevel: jest.fn().mockResolvedValue(1),
  getBatteryLevelSync: jest.fn(() => 1),
  getUserAgentSync: jest.fn(() => 'LNReader test'),
  useBatteryLevel: jest.fn(() => 1),
  getVersion: () => '1.0.0',
  getApplicationName: () => 'LNReader',
}));

jest.mock('@modules/native-file', () => ({
  __esModule: true,
  default: {
    DocumentDirectoryPath: '/mock/documents',
    ExternalDirectoryPath: '/mock/external',
    ExternalCachesDirectoryPath: '/mock/caches',
    writeFile: jest.fn(),
    readFile: jest.fn(() => ''),
    copyFile: jest.fn(),
    copyFileToDirectory: jest.fn(() =>
      Promise.resolve({ uri: '/mock/export.epub', size: 1 }),
    ),
    pickDirectory: jest.fn(() =>
      Promise.resolve({ uri: '/mock/export', name: 'export' }),
    ),
    moveFile: jest.fn(),
    exists: jest.fn(() => true),
    mkdir: jest.fn(),
    unlink: jest.fn(),
    readDir: jest.fn(() => []),
    downloadFile: jest.fn().mockResolvedValue(),
  },
}));

const mockEpubNovel = {
  name: 'Mock Novel',
  cover: null,
  summary: null,
  author: null,
  artist: null,
  chapters: [],
  cssPaths: [],
  imagePaths: [],
};

global.mockEpubNovel = mockEpubNovel;

jest.mock('@modules/native-volume-button-listener', () => ({
  __esModule: true,
  default: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListeners: jest.fn(),
    setActive: jest.fn(),
  },
}));

jest.mock('@modules/native-share-receiver', () => ({
  __esModule: true,
  default: {
    getInitialSharedText: jest.fn(async () => null),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListeners: jest.fn(),
  },
}));

jest.mock('@modules/native-zip-archive', () => ({
  __esModule: true,
  default: {
    zip: jest.fn().mockResolvedValue(),
    unzip: jest.fn().mockResolvedValue(),
    remoteUnzip: jest.fn().mockResolvedValue(),
    remoteZip: jest.fn().mockResolvedValue(''),
  },
}));

jest.mock('@modules/native-background-tasks', () => ({
  __esModule: true,
  default: {
    enqueue: jest.fn().mockResolvedValue('task-1'),
    cancel: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    resume: jest.fn().mockResolvedValue(undefined),
    complete: jest.fn().mockResolvedValue(undefined),
    fail: jest.fn().mockResolvedValue(undefined),
    getTasks: jest.fn().mockResolvedValue([]),
    updateProgress: jest.fn(),
    updateCheckpoint: jest.fn(),
    scheduleLibraryUpdates: jest.fn().mockResolvedValue(undefined),
    cancelLibraryUpdates: jest.fn().mockResolvedValue(undefined),
    scheduleAutomaticBackups: jest.fn().mockResolvedValue(undefined),
    cancelAutomaticBackups: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn(),
    signOut: jest.fn(),
    isSignedIn: jest.fn().mockResolvedValue(false),
    getTokens: jest.fn().mockResolvedValue({ accessToken: '' }),
  },
}));
