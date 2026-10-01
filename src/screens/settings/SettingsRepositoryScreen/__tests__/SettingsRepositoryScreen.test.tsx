import { fireEvent, render, screen, waitFor } from '@test-utils';

import SettingsRepositoryScreen from '../SettingsRepositoryScreen';
import { createRepository } from '@database/queries/RepositoryQueries';

const mockTheme = {
  error: '#ba1a1a',
  isDark: false,
  onPrimary: '#ffffff',
  onSurface: '#1d1b20',
  onSurfaceVariant: '#49454f',
  outline: '#79747e',
  primary: '#6750a4',
  rippleColor: 'rgba(0, 0, 0, 0.1)',
  scrim: '#000000',
  secondaryContainer: '#e8def8',
  surface: '#fffbfe',
  surfaceContainerHigh: '#ece6f0',
  surfaceVariant: '#e7e0ec',
};

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getApplicationName: () => 'LNReader',
  getBatteryLevelSync: () => 1,
}));

jest.mock('@screens/novel/NovelContext', () => ({
  NovelContextProvider: ({ children }: { children: any }) => children,
}));

jest.mock('@components/AppErrorBoundary/AppErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: any }) => children,
}));

const mockRefreshPlugins = jest.fn();
const mockSetParams = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@hooks/persisted/useTheme', () => ({
  ThemeProvider: ({ children }: { children: any }) => children,
  useTheme: () => mockTheme,
}));

jest.mock('@hooks/persisted', () => ({
  useTheme: () => mockTheme,
  usePluginActions: () => ({
    refreshPlugins: mockRefreshPlugins,
  }),
}));

jest.mock('@database/manager/liveQuery', () => ({
  useLiveQuery: () => [],
}));

jest.mock('@database/db', () => ({
  dbManager: {
    select: () => ({
      from: () => ({}),
    }),
  },
}));

jest.mock('@database/queries/RepositoryQueries', () => ({
  createRepository: jest.fn().mockResolvedValue(undefined),
  updateRepository: jest.fn().mockResolvedValue(undefined),
  setRepositoryEnabled: jest.fn().mockResolvedValue(undefined),
  isRepoUrlDuplicated: jest.fn().mockResolvedValue(false),
}));

jest.mock('@utils/showToast', () => ({
  showToast: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const ReactModule = require('react');
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };

  return {
    SafeAreaFrameContext: ReactModule.createContext(frame),
    SafeAreaInsetsContext: ReactModule.createContext(insets),
    SafeAreaProvider: ({ children }: { children: any }) => children,
    SafeAreaView: ({ children }: { children: any }) => children,
    initialWindowMetrics: { frame, insets },
    useSafeAreaFrame: () => frame,
    useSafeAreaInsets: () => insets,
  };
});

describe('SettingsRepositoryScreen deep linking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = (url?: string): any => ({
    route: {
      params: url ? { url } : undefined,
    },
    navigation: {
      canGoBack: () => true,
      goBack: mockGoBack,
      setParams: mockSetParams,
    },
  });

  it('does not show confirmation dialog when no url param is passed', () => {
    render(<SettingsRepositoryScreen {...createProps()} />);
    expect(screen.queryByText('Add repository?')).toBeNull();
    expect(createRepository).not.toHaveBeenCalled();
  });

  it('prompts confirmation when deep link url is passed and does not add silently', () => {
    const testUrl = 'https://example.com/plugins.min.json';
    render(<SettingsRepositoryScreen {...createProps(testUrl)} />);

    expect(screen.getByText('Add repository?')).toBeTruthy();
    expect(createRepository).not.toHaveBeenCalled();
  });

  it('dismisses dialog and clears params without installing when cancelled', async () => {
    const testUrl = 'https://example.com/plugins.min.json';
    render(<SettingsRepositoryScreen {...createProps(testUrl)} />);

    expect(screen.getByText('Add repository?')).toBeTruthy();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.press(cancelButton);

    await waitFor(() => {
      expect(mockSetParams).toHaveBeenCalledWith({ url: undefined });
    });
    expect(createRepository).not.toHaveBeenCalled();
  });

  it('installs repository, refreshes plugins, and clears params when confirmed', async () => {
    const testUrl = 'https://example.com/plugins.min.json';
    render(<SettingsRepositoryScreen {...createProps(testUrl)} />);

    expect(screen.getByText('Add repository?')).toBeTruthy();

    // Two buttons labeled 'Add' exist: the FAB and the dialog confirm button.
    // Query within the dialog or get the confirm action.
    const addButtons = screen.getAllByText('Add');
    const confirmButton = addButtons[addButtons.length - 1];
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(createRepository).toHaveBeenCalledWith(testUrl);
      expect(mockSetParams).toHaveBeenCalledWith({ url: undefined });
      expect(mockRefreshPlugins).toHaveBeenCalled();
    });
  });

  it('does not show confirmation dialog when url param is empty or whitespace', () => {
    render(<SettingsRepositoryScreen {...createProps('   ')} />);
    expect(screen.queryByText('Add repository?')).toBeNull();
    expect(createRepository).not.toHaveBeenCalled();
  });

  it('updates confirmation dialog when route params change with a new URL', () => {
    const url1 = 'https://example.com/repo1/plugins.min.json';
    const url2 = 'https://example.com/repo2/plugins.min.json';

    const { rerender } = render(
      <SettingsRepositoryScreen {...createProps(url1)} />,
    );
    expect(screen.getByText('Add repository?')).toBeTruthy();
    expect(screen.getByText(new RegExp(url1))).toBeTruthy();

    rerender(<SettingsRepositoryScreen {...createProps(url2)} />);
    expect(screen.getByText('Add repository?')).toBeTruthy();
    expect(screen.getByText(new RegExp(url2))).toBeTruthy();
  });
});
