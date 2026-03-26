import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';

interface HeaderContextType {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle?: string) => void;
  setBackAction: (show: boolean, onClick?: () => void) => void;
  portalTarget: HTMLDivElement | null;
  setPortalTarget: (target: HTMLDivElement | null) => void;
  resetHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [titleState, setTitleState] = useState('Vision PME');
  const [subtitleState, setSubtitleState] = useState<string | undefined>(
    undefined
  );
  const [showBack, setShowBack] = useState(false);
  const [onBackClick, setOnBackClick] = useState<(() => void) | undefined>(
    undefined
  );
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  const setTitle = useCallback(
    (newTitle: string) => setTitleState(newTitle),
    []
  );
  const setSubtitle = useCallback(
    (newSubtitle?: string) => setSubtitleState(newSubtitle),
    []
  );
  const setBackAction = useCallback((show: boolean, onClick?: () => void) => {
    setShowBack(show);
    setOnBackClick(() => onClick);
  }, []);

  const resetHeader = useCallback(() => {
    setTitleState('Vision PME');
    setSubtitleState(undefined);
    setShowBack(false);
    setOnBackClick(undefined);
  }, []);

  const value = useMemo(
    () => ({
      title: titleState,
      subtitle: subtitleState,
      showBack,
      onBackClick,
      setTitle,
      setSubtitle,
      setBackAction,
      portalTarget,
      setPortalTarget,
      resetHeader,
    }),
    [
      titleState,
      subtitleState,
      showBack,
      onBackClick,
      setTitle,
      setSubtitle,
      setBackAction,
      portalTarget,
      resetHeader,
    ]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};

/**
 * Component to teleport children into the Header's action slot
 */

export function HeaderActions({ children }: { children: ReactNode }) {
  const { portalTarget } = useHeader();

  if (!portalTarget) return null;

  return createPortal(children, portalTarget);
}
