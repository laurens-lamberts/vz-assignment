import { PropsWithChildren } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { Fonts, ThemeColor } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type TextSize = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

const fontSizes: Record<TextSize, { fontSize: number; lineHeight: number }> = {
  s: { fontSize: 14, lineHeight: 20 },
  m: { fontSize: 16, lineHeight: 24 },
  l: { fontSize: 20, lineHeight: 28 },
  xl: { fontSize: 24, lineHeight: 32 },
  xxl: { fontSize: 32, lineHeight: 44 },
  xxxl: { fontSize: 48, lineHeight: 52 },
};

const DEFAULT_SIZE: TextSize = 'm';
const DEFAULT_COLOR: ThemeColor = 'text';

export interface TextProps extends PropsWithChildren<RNTextProps> {
  size?: TextSize;
  color?: ThemeColor;
  center?: boolean;
  bold?: boolean;
  italic?: boolean;
}

export function Text({
  style,
  center,
  color = DEFAULT_COLOR,
  size = DEFAULT_SIZE,
  children,
  bold,
  italic,
  ...rest
}: TextProps) {
  const theme = useTheme();

  const styles: TextStyle[] = [
    {
      fontSize: fontSizes[size].fontSize,
      lineHeight: fontSizes[size].lineHeight,
      fontFamily: Fonts.normal,
      fontWeight: bold ? 'bold' : 'normal',
      color: theme[color],
    },
    center ? { textAlign: 'center' } : {},
    italic ? { fontStyle: 'italic' } : {},
  ];

  return (
    <RNText style={[...styles, style]} {...rest}>
      {children}
    </RNText>
  );
}
